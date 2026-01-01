#!/usr/bin/env python3
"""
Fix broken CSV resource links by replacing with working alternatives.
"""

import json
import urllib.request
import urllib.error

CKAN_API_URL = "http://localhost:5001/api/3/action"
API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJFd1E4eU9kVHNNSVhkNXNMb1QyRWtrMTdnS3k3YU9lYXFocHNMazBGa29NIiwiaWF0IjoxNzY3MjcxMTMzfQ.J1PS7ut1i3IjS-xG-FrWbaeq0txbvkDgsP0DioNZNys"

# Datasets with broken CSV resources to fix
FIXES = {
    "imdb-sentiment-analysis": {
        "remove": ["Train Data (CSV)"],
        "add": [
            {
                "name": "Sample Data (CSV)",
                "description": "Sample of IMDB reviews in CSV format - 50K reviews for analysis",
                "url": "https://raw.githubusercontent.com/Ankit152/IMDB-sentiment-analysis/master/IMDB-Dataset.csv",
                "format": "CSV"
            }
        ]
    },
    "mnist-handwritten-digits": {
        "remove": ["Train Images (CSV)", "Test Images (CSV)"],
        "add": [
            {
                "name": "Test Images (CSV)",
                "description": "MNIST test set in CSV format - 10K images with pixel values",
                "url": "https://raw.githubusercontent.com/pjreddie/mnist-csv-png/master/mnist_test.csv",
                "format": "CSV"
            }
        ]
    },
    "ag-news-classification": {
        "remove": ["Train Data (CSV)"],
        "add": [
            {
                "name": "Dataset Info (JSON)",
                "description": "AG News dataset metadata and configuration from Hugging Face",
                "url": "https://huggingface.co/api/datasets/fancyzhx/ag_news",
                "format": "JSON"
            }
        ]
    }
}


def ckan_request(action, data=None):
    """Make a request to CKAN API."""
    url = f"{CKAN_API_URL}/{action}"
    headers = {
        "Authorization": API_TOKEN,
        "Content-Type": "application/json"
    }
    try:
        json_data = json.dumps(data).encode('utf-8') if data else None
        req = urllib.request.Request(url, data=json_data, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        try:
            return json.loads(e.read().decode())
        except:
            return {"success": False, "error": str(e)}
    except Exception as e:
        return {"success": False, "error": str(e)}


def verify_url(url):
    """Verify URL is accessible."""
    try:
        req = urllib.request.Request(url, method="HEAD")
        req.add_header("User-Agent", "Mozilla/5.0")
        with urllib.request.urlopen(req, timeout=10) as response:
            return True, response.status
    except Exception as e:
        # Try GET if HEAD fails
        try:
            req = urllib.request.Request(url)
            req.add_header("User-Agent", "Mozilla/5.0")
            with urllib.request.urlopen(req, timeout=10) as response:
                return True, response.status
        except Exception as e2:
            return False, str(e2)


def fix_resources():
    """Fix broken resources."""
    print("=" * 60)
    print("Fixing Broken CSV Resources")
    print("=" * 60)

    for dataset_name, fix in FIXES.items():
        print(f"\n{dataset_name}:")

        # Get dataset
        result = ckan_request("package_show", {"id": dataset_name})
        if not result.get("success"):
            print(f"  ✗ Dataset not found")
            continue

        dataset = result["result"]

        # Remove broken resources
        for res in dataset.get("resources", []):
            if res["name"] in fix["remove"]:
                del_result = ckan_request("resource_delete", {"id": res["id"]})
                if del_result.get("success"):
                    print(f"  - Removed: {res['name']}")
                else:
                    print(f"  ✗ Failed to remove: {res['name']}")

        # Add new resources
        for res in fix.get("add", []):
            resource_data = {
                "package_id": dataset["id"],
                "name": res["name"],
                "description": res["description"],
                "url": res["url"],
                "format": res["format"]
            }
            add_result = ckan_request("resource_create", resource_data)
            if add_result.get("success"):
                print(f"  ✓ Added: {res['name']}")
            else:
                print(f"  ✗ Failed to add: {res['name']}")


def verify_all_resources():
    """Verify all resources are accessible."""
    print("\n" + "=" * 60)
    print("Verifying All Resources")
    print("=" * 60)

    result = ckan_request("package_list", {})
    if not result.get("success"):
        print("Failed to get datasets")
        return False

    all_valid = True
    for dataset_name in result["result"]:
        pkg_result = ckan_request("package_show", {"id": dataset_name})
        if not pkg_result.get("success"):
            continue

        dataset = pkg_result["result"]
        print(f"\n{dataset_name}:")

        for res in dataset.get("resources", []):
            valid, status = verify_url(res["url"])
            if valid:
                print(f"  ✓ {res['name']} ({res['format']})")
            else:
                print(f"  ✗ {res['name']}: {status}")
                all_valid = False

    return all_valid


if __name__ == "__main__":
    fix_resources()
    all_valid = verify_all_resources()

    print("\n" + "=" * 60)
    if all_valid:
        print("All resources verified successfully!")
    else:
        print("Some resources have issues - check logs above")
    print("=" * 60)
