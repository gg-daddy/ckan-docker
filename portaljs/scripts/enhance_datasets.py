#!/usr/bin/env python3
"""
Enhance CKAN datasets with:
1. Multiple organizations (5+)
2. Multiple file types (Parquet, CSV, PDF papers from arXiv)
3. Redistribute datasets across organizations
"""

import json
import urllib.request
import urllib.error

CKAN_API_URL = "http://localhost:5001/api/3/action"
API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJFd1E4eU9kVHNNSVhkNXNMb1QyRWtrMTdnS3k3YU9lYXFocHNMazBGa29NIiwiaWF0IjoxNzY3MjcxMTMzfQ.J1PS7ut1i3IjS-xG-FrWbaeq0txbvkDgsP0DioNZNys"

# Organizations to create
ORGANIZATIONS = [
    {
        "name": "stanford-nlp",
        "title": "Stanford NLP Group",
        "description": "Stanford Natural Language Processing Group - Leading research in computational linguistics, machine learning, and deep learning for NLP.",
        "image_url": "https://nlp.stanford.edu/img/stanfordnlp-logo.png"
    },
    {
        "name": "openai-research",
        "title": "OpenAI Research",
        "description": "OpenAI is an AI research laboratory dedicated to ensuring artificial general intelligence benefits all of humanity.",
        "image_url": "https://openai.com/favicon.ico"
    },
    {
        "name": "meta-ai",
        "title": "Meta AI Research",
        "description": "Meta AI (formerly Facebook AI Research) conducts cutting-edge research in artificial intelligence and machine learning.",
        "image_url": "https://ai.meta.com/favicon.ico"
    },
    {
        "name": "google-research",
        "title": "Google Research",
        "description": "Google Research advances the state-of-the-art in computer science and related fields through open research.",
        "image_url": "https://research.google/favicon.ico"
    },
    {
        "name": "academic-benchmarks",
        "title": "Academic ML Benchmarks",
        "description": "Collection of benchmark datasets from academic institutions for machine learning research and evaluation.",
        "image_url": ""
    }
]

# Dataset configurations with organizations and resources
DATASET_CONFIG = {
    "imdb-sentiment-analysis": {
        "org": "stanford-nlp",
        "resources": [
            {
                "name": "Train Data (Parquet)",
                "description": "Training split - 25,000 movie reviews with binary sentiment labels",
                "url": "https://huggingface.co/datasets/stanfordnlp/imdb/resolve/main/plain_text/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Test Data (Parquet)",
                "description": "Test split - 25,000 movie reviews with binary sentiment labels",
                "url": "https://huggingface.co/datasets/stanfordnlp/imdb/resolve/main/plain_text/test-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Train Data (CSV)",
                "description": "Training split in CSV format for easy analysis in spreadsheet applications",
                "url": "https://huggingface.co/datasets/stanfordnlp/imdb/resolve/refs%2Fconvert%2Fcsv/plain_text/train.csv",
                "format": "CSV"
            },
            {
                "name": "Research Paper (PDF)",
                "description": "Learning Word Vectors for Sentiment Analysis - Original IMDB dataset paper from ACL 2011",
                "url": "https://aclanthology.org/P11-1015.pdf",
                "format": "PDF"
            },
            {
                "name": "Sentiment Analysis Survey (PDF)",
                "description": "Deep Learning for Sentiment Analysis: A Survey - Comprehensive overview from arXiv",
                "url": "https://arxiv.org/pdf/1801.07883.pdf",
                "format": "PDF"
            }
        ]
    },
    "squad-question-answering": {
        "org": "stanford-nlp",
        "resources": [
            {
                "name": "Train Data (Parquet)",
                "description": "Training split - 87,599 question-answer pairs from Wikipedia articles",
                "url": "https://huggingface.co/datasets/rajpurkar/squad/resolve/main/plain_text/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Validation Data (Parquet)",
                "description": "Validation split - 10,570 question-answer pairs",
                "url": "https://huggingface.co/datasets/rajpurkar/squad/resolve/main/plain_text/validation-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Original Dataset (JSON)",
                "description": "SQuAD 1.1 in original JSON format with context paragraphs",
                "url": "https://rajpurkar.github.io/SQuAD-explorer/dataset/train-v1.1.json",
                "format": "JSON"
            },
            {
                "name": "SQuAD Paper (PDF)",
                "description": "SQuAD: 100,000+ Questions for Machine Comprehension of Text - Original paper from arXiv",
                "url": "https://arxiv.org/pdf/1606.05250.pdf",
                "format": "PDF"
            },
            {
                "name": "SQuAD 2.0 Paper (PDF)",
                "description": "Know What You Don't Know: Unanswerable Questions for SQuAD",
                "url": "https://arxiv.org/pdf/1806.03822.pdf",
                "format": "PDF"
            }
        ]
    },
    "cnn-dailymail-summarization": {
        "org": "meta-ai",
        "resources": [
            {
                "name": "Train Data (Parquet)",
                "description": "Training split - 287,113 news articles with highlight summaries",
                "url": "https://huggingface.co/datasets/abisee/cnn_dailymail/resolve/main/3.0.0/train-00000-of-00003.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Test Data (Parquet)",
                "description": "Test split - 11,490 news articles with highlight summaries",
                "url": "https://huggingface.co/datasets/abisee/cnn_dailymail/resolve/main/3.0.0/test-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Pointer-Generator Paper (PDF)",
                "description": "Get To The Point: Summarization with Pointer-Generator Networks - Key paper on this dataset",
                "url": "https://arxiv.org/pdf/1704.04368.pdf",
                "format": "PDF"
            },
            {
                "name": "Teaching Machines to Read Paper (PDF)",
                "description": "Teaching Machines to Read and Comprehend - Original CNN/DailyMail paper from DeepMind",
                "url": "https://arxiv.org/pdf/1506.03340.pdf",
                "format": "PDF"
            }
        ]
    },
    "mnist-handwritten-digits": {
        "org": "academic-benchmarks",
        "resources": [
            {
                "name": "Train Images (Parquet)",
                "description": "Training split - 60,000 handwritten digit images (28x28 grayscale)",
                "url": "https://huggingface.co/datasets/ylecun/mnist/resolve/main/mnist/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Test Images (Parquet)",
                "description": "Test split - 10,000 handwritten digit images",
                "url": "https://huggingface.co/datasets/ylecun/mnist/resolve/main/mnist/test-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Train Images (CSV)",
                "description": "Training images flattened to CSV format (784 pixel values + label)",
                "url": "https://pjreddie.com/media/files/mnist_train.csv",
                "format": "CSV"
            },
            {
                "name": "Test Images (CSV)",
                "description": "Test images flattened to CSV format",
                "url": "https://pjreddie.com/media/files/mnist_test.csv",
                "format": "CSV"
            },
            {
                "name": "MNIST Paper (PDF)",
                "description": "Gradient-Based Learning Applied to Document Recognition - Yann LeCun's foundational paper",
                "url": "http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf",
                "format": "PDF"
            }
        ]
    },
    "cifar10-image-classification": {
        "org": "academic-benchmarks",
        "resources": [
            {
                "name": "Train Images (Parquet)",
                "description": "Training split - 50,000 color images (32x32) in 10 classes",
                "url": "https://huggingface.co/datasets/uoft-cs/cifar10/resolve/main/plain_text/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Test Images (Parquet)",
                "description": "Test split - 10,000 color images in 10 classes",
                "url": "https://huggingface.co/datasets/uoft-cs/cifar10/resolve/main/plain_text/test-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "CIFAR-10 Technical Report (PDF)",
                "description": "Learning Multiple Layers of Features from Tiny Images - Original technical report",
                "url": "https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf",
                "format": "PDF"
            },
            {
                "name": "ResNet Paper (PDF)",
                "description": "Deep Residual Learning for Image Recognition - Benchmark results on CIFAR-10",
                "url": "https://arxiv.org/pdf/1512.03385.pdf",
                "format": "PDF"
            }
        ]
    },
    "wikitext-language-modeling": {
        "org": "meta-ai",
        "resources": [
            {
                "name": "WikiText-2 Train (Parquet)",
                "description": "WikiText-2 training split - ~2M tokens from Wikipedia Good/Featured articles",
                "url": "https://huggingface.co/datasets/Salesforce/wikitext/resolve/main/wikitext-2-v1/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "WikiText-103 Train (Parquet)",
                "description": "WikiText-103 training split - ~103M tokens for large-scale language modeling",
                "url": "https://huggingface.co/datasets/Salesforce/wikitext/resolve/main/wikitext-103-v1/train-00000-of-00002.parquet",
                "format": "PARQUET"
            },
            {
                "name": "WikiText Paper (PDF)",
                "description": "Pointer Sentinel Mixture Models - Paper introducing WikiText dataset",
                "url": "https://arxiv.org/pdf/1609.07843.pdf",
                "format": "PDF"
            },
            {
                "name": "GPT-2 Paper (PDF)",
                "description": "Language Models are Unsupervised Multitask Learners - Uses WikiText for evaluation",
                "url": "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf",
                "format": "PDF"
            }
        ]
    },
    "glue-benchmark": {
        "org": "academic-benchmarks",
        "resources": [
            {
                "name": "SST-2 Train (Parquet)",
                "description": "Stanford Sentiment Treebank - Binary sentiment classification task",
                "url": "https://huggingface.co/datasets/nyu-mll/glue/resolve/main/sst2/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "MNLI Train (Parquet)",
                "description": "Multi-Genre Natural Language Inference - Large-scale NLI task",
                "url": "https://huggingface.co/datasets/nyu-mll/glue/resolve/main/mnli/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "CoLA Train (Parquet)",
                "description": "Corpus of Linguistic Acceptability - Grammaticality judgment task",
                "url": "https://huggingface.co/datasets/nyu-mll/glue/resolve/main/cola/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "GLUE Benchmark Paper (PDF)",
                "description": "GLUE: A Multi-Task Benchmark and Analysis Platform for NLU - Original paper",
                "url": "https://arxiv.org/pdf/1804.07461.pdf",
                "format": "PDF"
            },
            {
                "name": "SuperGLUE Paper (PDF)",
                "description": "SuperGLUE: A Stickier Benchmark for General-Purpose Language Understanding",
                "url": "https://arxiv.org/pdf/1905.00537.pdf",
                "format": "PDF"
            },
            {
                "name": "BERT Paper (PDF)",
                "description": "BERT: Pre-training of Deep Bidirectional Transformers - Achieves SOTA on GLUE",
                "url": "https://arxiv.org/pdf/1810.04805.pdf",
                "format": "PDF"
            }
        ]
    },
    "gsm8k-math-reasoning": {
        "org": "openai-research",
        "resources": [
            {
                "name": "Train Data (Parquet)",
                "description": "Training split - 7,473 grade school math word problems with solutions",
                "url": "https://huggingface.co/datasets/openai/gsm8k/resolve/main/main/train-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Test Data (Parquet)",
                "description": "Test split - 1,319 math word problems for evaluation",
                "url": "https://huggingface.co/datasets/openai/gsm8k/resolve/main/main/test-00000-of-00001.parquet",
                "format": "PARQUET"
            },
            {
                "name": "GSM8K Paper (PDF)",
                "description": "Training Verifiers to Solve Math Word Problems - Original GSM8K paper from OpenAI",
                "url": "https://arxiv.org/pdf/2110.14168.pdf",
                "format": "PDF"
            },
            {
                "name": "Chain-of-Thought Paper (PDF)",
                "description": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
                "url": "https://arxiv.org/pdf/2201.11903.pdf",
                "format": "PDF"
            }
        ]
    },
    "dolly-instruction-following": {
        "org": "google-research",
        "resources": [
            {
                "name": "Full Dataset (Parquet)",
                "description": "15,000 human-generated instruction-response pairs across multiple categories",
                "url": "https://huggingface.co/api/datasets/databricks/databricks-dolly-15k/parquet/default/train/0.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Dataset (JSONL)",
                "description": "Full dataset in JSON Lines format for easy streaming",
                "url": "https://huggingface.co/datasets/databricks/databricks-dolly-15k/resolve/main/databricks-dolly-15k.jsonl",
                "format": "JSONL"
            },
            {
                "name": "Self-Instruct Paper (PDF)",
                "description": "Self-Instruct: Aligning Language Models with Self-Generated Instructions",
                "url": "https://arxiv.org/pdf/2212.10560.pdf",
                "format": "PDF"
            },
            {
                "name": "InstructGPT Paper (PDF)",
                "description": "Training language models to follow instructions with human feedback",
                "url": "https://arxiv.org/pdf/2203.02155.pdf",
                "format": "PDF"
            }
        ]
    },
    "ag-news-classification": {
        "org": "academic-benchmarks",
        "resources": [
            {
                "name": "Train Data (Parquet)",
                "description": "Training split - 120,000 news articles in 4 categories (World, Sports, Business, Sci/Tech)",
                "url": "https://huggingface.co/api/datasets/fancyzhx/ag_news/parquet/default/train/0.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Test Data (Parquet)",
                "description": "Test split - 7,600 news articles for evaluation",
                "url": "https://huggingface.co/api/datasets/fancyzhx/ag_news/parquet/default/test/0.parquet",
                "format": "PARQUET"
            },
            {
                "name": "Train Data (CSV)",
                "description": "Training data in CSV format with class index and text",
                "url": "https://raw.githubusercontent.com/mhjabreel/CharCnn_Keras/master/data/ag_news_csv/train.csv",
                "format": "CSV"
            },
            {
                "name": "Character CNN Paper (PDF)",
                "description": "Character-level Convolutional Networks for Text Classification - Introduces AG News benchmark",
                "url": "https://arxiv.org/pdf/1509.01626.pdf",
                "format": "PDF"
            }
        ]
    }
}


def ckan_request(action, data=None):
    """Make a request to CKAN API."""
    url = f"{CKAN_API_URL}/{action}"
    headers = {"Authorization": API_TOKEN, "Content-Type": "application/json"}
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


def create_organizations():
    """Create all organizations."""
    print("\n" + "=" * 60)
    print("Creating Organizations")
    print("=" * 60)

    # First delete the old huggingface-datasets org if it exists
    ckan_request("organization_delete", {"id": "huggingface-datasets"})
    ckan_request("organization_purge", {"id": "huggingface-datasets"})

    for org in ORGANIZATIONS:
        result = ckan_request("organization_show", {"id": org["name"]})
        if result.get("success"):
            print(f"  ✓ Already exists: {org['title']}")
        else:
            result = ckan_request("organization_create", org)
            if result.get("success"):
                print(f"  ✓ Created: {org['title']}")
            else:
                print(f"  ✗ Failed: {org['title']} - {result.get('error', {})}")


def update_datasets():
    """Update datasets with new organizations and resources."""
    print("\n" + "=" * 60)
    print("Updating Datasets")
    print("=" * 60)

    for dataset_name, config in DATASET_CONFIG.items():
        print(f"\n{dataset_name}:")

        # Get current dataset
        result = ckan_request("package_show", {"id": dataset_name})
        if not result.get("success"):
            print(f"  ✗ Dataset not found")
            continue

        dataset = result["result"]

        # Update organization
        update_result = ckan_request("package_patch", {
            "id": dataset["id"],
            "owner_org": config["org"]
        })
        if update_result.get("success"):
            print(f"  ✓ Moved to org: {config['org']}")
        else:
            print(f"  ✗ Failed to update org: {update_result.get('error', {})}")

        # Delete existing resources
        for resource in dataset.get("resources", []):
            ckan_request("resource_delete", {"id": resource["id"]})
        print(f"  - Cleared {len(dataset.get('resources', []))} old resources")

        # Add new resources
        for res in config["resources"]:
            resource_data = {
                "package_id": dataset["id"],
                "name": res["name"],
                "description": res["description"],
                "url": res["url"],
                "format": res["format"]
            }
            result = ckan_request("resource_create", resource_data)
            if result.get("success"):
                print(f"  ✓ Added: {res['name']} ({res['format']})")
            else:
                print(f"  ✗ Failed: {res['name']}")


def verify_resources():
    """Verify that resource URLs are accessible."""
    print("\n" + "=" * 60)
    print("Verifying Resource URLs (sampling)")
    print("=" * 60)

    # Sample a few resources to verify
    test_urls = [
        ("IMDB CSV", "https://huggingface.co/datasets/stanfordnlp/imdb/resolve/refs%2Fconvert%2Fcsv/plain_text/train.csv"),
        ("SQuAD Paper", "https://arxiv.org/pdf/1606.05250.pdf"),
        ("MNIST CSV", "https://pjreddie.com/media/files/mnist_train.csv"),
        ("GLUE Paper", "https://arxiv.org/pdf/1804.07461.pdf"),
        ("AG News CSV", "https://raw.githubusercontent.com/mhjabreel/CharCnn_Keras/master/data/ag_news_csv/train.csv"),
    ]

    for name, url in test_urls:
        try:
            req = urllib.request.Request(url, method="HEAD")
            req.add_header("User-Agent", "Mozilla/5.0")
            with urllib.request.urlopen(req, timeout=10) as resp:
                size = resp.headers.get("Content-Length", "unknown")
                print(f"  ✓ {name}: OK ({size} bytes)")
        except Exception as e:
            print(f"  ✗ {name}: {str(e)[:50]}")


def print_summary():
    """Print summary of organizations and datasets."""
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)

    print("\nOrganizations:")
    for org in ORGANIZATIONS:
        print(f"  • {org['title']}")

    print("\nDatasets by Organization:")
    org_datasets = {}
    for ds_name, config in DATASET_CONFIG.items():
        org = config["org"]
        if org not in org_datasets:
            org_datasets[org] = []
        org_datasets[org].append(ds_name)

    for org, datasets in org_datasets.items():
        org_title = next((o["title"] for o in ORGANIZATIONS if o["name"] == org), org)
        print(f"\n  {org_title}:")
        for ds in datasets:
            res_count = len(DATASET_CONFIG[ds]["resources"])
            formats = set(r["format"] for r in DATASET_CONFIG[ds]["resources"])
            print(f"    - {ds} ({res_count} resources: {', '.join(sorted(formats))})")


if __name__ == "__main__":
    print("=" * 60)
    print("Enhancing CKAN Datasets")
    print("=" * 60)

    create_organizations()
    update_datasets()
    verify_resources()
    print_summary()

    print("\n" + "=" * 60)
    print("Enhancement Complete!")
    print("=" * 60)
