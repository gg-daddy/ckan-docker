#!/usr/bin/env python3
"""
Update CKAN resources with downloadable Hugging Face parquet files.
"""

import json
import urllib.request
import urllib.error

CKAN_API_URL = "http://localhost:5001/api/3/action"
API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJFd1E4eU9kVHNNSVhkNXNMb1QyRWtrMTdnS3k3YU9lYXFocHNMazBGa29NIiwiaWF0IjoxNzY3MjcxMTMzfQ.J1PS7ut1i3IjS-xG-FrWbaeq0txbvkDgsP0DioNZNys"

# Dataset resource configurations with actual downloadable URLs
DATASET_RESOURCES = {
    "imdb-sentiment-analysis": {
        "hf_id": "stanfordnlp/imdb",
        "resources": [
            {
                "name": "Train Split (Parquet)",
                "description": "Training data - 25,000 movie reviews with sentiment labels",
                "url": "https://huggingface.co/datasets/stanfordnlp/imdb/resolve/main/plain_text/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "33 MB"
            },
            {
                "name": "Test Split (Parquet)",
                "description": "Test data - 25,000 movie reviews with sentiment labels",
                "url": "https://huggingface.co/datasets/stanfordnlp/imdb/resolve/main/plain_text/test-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "32 MB"
            }
        ]
    },
    "squad-question-answering": {
        "hf_id": "rajpurkar/squad",
        "resources": [
            {
                "name": "Train Split (Parquet)",
                "description": "Training data - 87,599 question-answer pairs",
                "url": "https://huggingface.co/datasets/rajpurkar/squad/resolve/main/plain_text/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "30 MB"
            },
            {
                "name": "Validation Split (Parquet)",
                "description": "Validation data - 10,570 question-answer pairs",
                "url": "https://huggingface.co/datasets/rajpurkar/squad/resolve/main/plain_text/validation-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "4 MB"
            }
        ]
    },
    "cnn-dailymail-summarization": {
        "hf_id": "abisee/cnn_dailymail",
        "resources": [
            {
                "name": "Train Split v3.0.0 (Parquet)",
                "description": "Training data - 287,113 news articles with summaries",
                "url": "https://huggingface.co/datasets/abisee/cnn_dailymail/resolve/main/3.0.0/train-00000-of-00003.parquet",
                "format": "PARQUET",
                "size": "280 MB"
            },
            {
                "name": "Test Split v3.0.0 (Parquet)",
                "description": "Test data - 11,490 news articles with summaries",
                "url": "https://huggingface.co/datasets/abisee/cnn_dailymail/resolve/main/3.0.0/test-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "17 MB"
            }
        ]
    },
    "mnist-handwritten-digits": {
        "hf_id": "ylecun/mnist",
        "resources": [
            {
                "name": "Train Split (Parquet)",
                "description": "Training images - 60,000 handwritten digit images",
                "url": "https://huggingface.co/datasets/ylecun/mnist/resolve/main/mnist/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "17 MB"
            },
            {
                "name": "Test Split (Parquet)",
                "description": "Test images - 10,000 handwritten digit images",
                "url": "https://huggingface.co/datasets/ylecun/mnist/resolve/main/mnist/test-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "3 MB"
            }
        ]
    },
    "cifar10-image-classification": {
        "hf_id": "uoft-cs/cifar10",
        "resources": [
            {
                "name": "Train Split (Parquet)",
                "description": "Training images - 50,000 color images in 10 classes",
                "url": "https://huggingface.co/datasets/uoft-cs/cifar10/resolve/main/plain_text/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "114 MB"
            },
            {
                "name": "Test Split (Parquet)",
                "description": "Test images - 10,000 color images in 10 classes",
                "url": "https://huggingface.co/datasets/uoft-cs/cifar10/resolve/main/plain_text/test-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "23 MB"
            }
        ]
    },
    "wikitext-language-modeling": {
        "hf_id": "Salesforce/wikitext",
        "resources": [
            {
                "name": "WikiText-2 Train (Parquet)",
                "description": "Training data - WikiText-2 with ~2M tokens",
                "url": "https://huggingface.co/datasets/Salesforce/wikitext/resolve/main/wikitext-2-v1/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "4 MB"
            },
            {
                "name": "WikiText-103 Train (Parquet)",
                "description": "Training data - WikiText-103 with ~103M tokens",
                "url": "https://huggingface.co/datasets/Salesforce/wikitext/resolve/main/wikitext-103-v1/train-00000-of-00002.parquet",
                "format": "PARQUET",
                "size": "180 MB"
            }
        ]
    },
    "glue-benchmark": {
        "hf_id": "nyu-mll/glue",
        "resources": [
            {
                "name": "SST-2 Train (Parquet)",
                "description": "Stanford Sentiment Treebank - binary sentiment classification",
                "url": "https://huggingface.co/datasets/nyu-mll/glue/resolve/main/sst2/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "7 MB"
            },
            {
                "name": "MNLI Train (Parquet)",
                "description": "Multi-Genre Natural Language Inference",
                "url": "https://huggingface.co/datasets/nyu-mll/glue/resolve/main/mnli/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "100 MB"
            },
            {
                "name": "CoLA Train (Parquet)",
                "description": "Corpus of Linguistic Acceptability",
                "url": "https://huggingface.co/datasets/nyu-mll/glue/resolve/main/cola/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "400 KB"
            }
        ]
    },
    "gsm8k-math-reasoning": {
        "hf_id": "openai/gsm8k",
        "resources": [
            {
                "name": "Train Split - Main (Parquet)",
                "description": "Training data - 7,473 math word problems with solutions",
                "url": "https://huggingface.co/datasets/openai/gsm8k/resolve/main/main/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "4 MB"
            },
            {
                "name": "Test Split - Main (Parquet)",
                "description": "Test data - 1,319 math word problems with solutions",
                "url": "https://huggingface.co/datasets/openai/gsm8k/resolve/main/main/test-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "700 KB"
            }
        ]
    },
    "dolly-instruction-following": {
        "hf_id": "databricks/databricks-dolly-15k",
        "resources": [
            {
                "name": "Full Dataset (Parquet)",
                "description": "15,000 human-generated instruction-response pairs",
                "url": "https://huggingface.co/datasets/databricks/databricks-dolly-15k/resolve/main/databricks-dolly-15k.parquet",
                "format": "PARQUET",
                "size": "13 MB"
            }
        ]
    },
    "ag-news-classification": {
        "hf_id": "fancyzhx/ag_news",
        "resources": [
            {
                "name": "Train Split (Parquet)",
                "description": "Training data - 120,000 news articles in 4 categories",
                "url": "https://huggingface.co/datasets/fancyzhx/ag_news/resolve/main/default/train-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "29 MB"
            },
            {
                "name": "Test Split (Parquet)",
                "description": "Test data - 7,600 news articles in 4 categories",
                "url": "https://huggingface.co/datasets/fancyzhx/ag_news/resolve/main/default/test-00000-of-00001.parquet",
                "format": "PARQUET",
                "size": "2 MB"
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


def update_dataset_resources():
    """Update resources for all datasets."""
    print("=" * 60)
    print("Updating CKAN Resources with Downloadable URLs")
    print("=" * 60)

    for dataset_name, config in DATASET_RESOURCES.items():
        print(f"\n{dataset_name}:")

        # Get current dataset
        result = ckan_request("package_show", {"id": dataset_name})
        if not result.get("success"):
            print(f"  ✗ Dataset not found")
            continue

        dataset = result["result"]

        # Delete existing resources
        for resource in dataset.get("resources", []):
            ckan_request("resource_delete", {"id": resource["id"]})
            print(f"  - Removed old resource: {resource['name']}")

        # Add new resources
        for res in config["resources"]:
            resource_data = {
                "package_id": dataset["id"],
                "name": res["name"],
                "description": res["description"],
                "url": res["url"],
                "format": res["format"],
            }
            result = ckan_request("resource_create", resource_data)
            if result.get("success"):
                print(f"  ✓ Added: {res['name']}")
            else:
                print(f"  ✗ Failed to add: {res['name']} - {result.get('error', {})}")


def verify_urls():
    """Verify that resource URLs are accessible."""
    print("\n" + "=" * 60)
    print("Verifying Resource URLs")
    print("=" * 60)

    for dataset_name, config in DATASET_RESOURCES.items():
        print(f"\n{dataset_name}:")
        for res in config["resources"]:
            try:
                req = urllib.request.Request(res["url"], method="HEAD")
                req.add_header("User-Agent", "Mozilla/5.0")
                with urllib.request.urlopen(req, timeout=10) as response:
                    status = response.status
                    size = response.headers.get("Content-Length", "unknown")
                    print(f"  ✓ {res['name']}: {status} OK ({size} bytes)")
            except Exception as e:
                print(f"  ✗ {res['name']}: {e}")


if __name__ == "__main__":
    update_dataset_resources()
    verify_urls()
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)
