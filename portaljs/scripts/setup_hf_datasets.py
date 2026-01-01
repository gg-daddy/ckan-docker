#!/usr/bin/env python3
"""
Setup Hugging Face datasets in CKAN with corresponding MDX documentation files.
"""

import json
import os
import urllib.request
import urllib.error
from datetime import datetime

# Configuration
CKAN_API_URL = "http://localhost:5001/api/3/action"
API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJFd1E4eU9kVHNNSVhkNXNMb1QyRWtrMTdnS3k3YU9lYXFocHNMazBGa29NIiwiaWF0IjoxNzY3MjcxMTMzfQ.J1PS7ut1i3IjS-xG-FrWbaeq0txbvkDgsP0DioNZNys"
MDX_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "content", "datasets")

# Dataset definitions with comprehensive metadata
DATASETS = [
    {
        "name": "imdb-sentiment-analysis",
        "title": "IMDB Movie Reviews - Sentiment Analysis",
        "hf_id": "stanfordnlp/imdb",
        "notes": """The IMDB dataset is a large-scale movie review dataset for binary sentiment classification. It contains 50,000 highly polar movie reviews split evenly into 25,000 training and 25,000 test samples.

This dataset is widely used as a benchmark for sentiment analysis and text classification tasks. Each review is labeled as either positive or negative based on the overall sentiment expressed.

**Key Features:**
- Binary sentiment classification (positive/negative)
- 50,000 movie reviews total
- Balanced dataset with equal positive and negative samples
- English language text""",
        "author": "Stanford NLP Group",
        "author_email": "nlp-stanford@stanford.edu",
        "maintainer": "Andrew Maas",
        "license_id": "other-open",
        "tags": ["sentiment-analysis", "text-classification", "nlp", "movie-reviews", "binary-classification"],
        "task": "Text Classification",
        "modality": "Text",
        "language": "English",
        "size": "100K rows",
        "downloads": "120K+",
        "format": "parquet"
    },
    {
        "name": "squad-question-answering",
        "title": "SQuAD - Stanford Question Answering Dataset",
        "hf_id": "rajpurkar/squad",
        "notes": """Stanford Question Answering Dataset (SQuAD) is a reading comprehension dataset consisting of questions posed by crowdworkers on a set of Wikipedia articles.

The answer to every question is a segment of text (a span) from the corresponding reading passage, or the question might be unanswerable. SQuAD 1.1 contains 100,000+ question-answer pairs on 500+ articles.

**Key Features:**
- Extractive question answering
- 100,000+ question-answer pairs
- Based on Wikipedia articles
- Human-annotated answers""",
        "author": "Stanford NLP Group",
        "author_email": "pranavsr@stanford.edu",
        "maintainer": "Pranav Rajpurkar",
        "license_id": "cc-by-sa",
        "tags": ["question-answering", "reading-comprehension", "nlp", "extractive-qa", "wikipedia"],
        "task": "Question Answering",
        "modality": "Text",
        "language": "English",
        "size": "87K training examples",
        "downloads": "108K+",
        "format": "parquet"
    },
    {
        "name": "cnn-dailymail-summarization",
        "title": "CNN/DailyMail - News Summarization Dataset",
        "hf_id": "abisee/cnn_dailymail",
        "notes": """The CNN/DailyMail dataset is a large-scale English news summarization dataset containing over 300,000 unique news articles from CNN and the Daily Mail.

Each article comes with multi-sentence summaries (highlights) making it ideal for abstractive and extractive summarization research. This is one of the most widely used datasets for text summarization benchmarks.

**Key Features:**
- 300K+ news articles with summaries
- Multi-sentence highlights as targets
- Supports both extractive and abstractive summarization
- Real-world news content""",
        "author": "Abigail See",
        "author_email": "abisee@stanford.edu",
        "maintainer": "Abigail See",
        "license_id": "apache",
        "tags": ["summarization", "text-generation", "nlp", "news", "abstractive-summarization"],
        "task": "Summarization",
        "modality": "Text",
        "language": "English",
        "size": "300K articles",
        "downloads": "84K+",
        "format": "parquet"
    },
    {
        "name": "mnist-handwritten-digits",
        "title": "MNIST - Handwritten Digit Recognition",
        "hf_id": "ylecun/mnist",
        "notes": """The MNIST dataset is the most famous benchmark dataset in machine learning. It consists of 70,000 grayscale images of handwritten digits (0-9), each 28x28 pixels.

Originally created by Yann LeCun and colleagues, MNIST has become the "Hello World" of computer vision and deep learning. It's widely used for benchmarking image classification algorithms.

**Key Features:**
- 70,000 grayscale images (60K train, 10K test)
- 28x28 pixel resolution
- 10 classes (digits 0-9)
- Extracted from NIST databases""",
        "author": "Yann LeCun",
        "author_email": "yann@cs.nyu.edu",
        "maintainer": "Yann LeCun",
        "license_id": "mit",
        "tags": ["image-classification", "computer-vision", "handwritten-digits", "deep-learning", "benchmark"],
        "task": "Image Classification",
        "modality": "Image",
        "language": "N/A",
        "size": "70K images",
        "downloads": "79K+",
        "format": "parquet"
    },
    {
        "name": "cifar10-image-classification",
        "title": "CIFAR-10 - Image Classification Benchmark",
        "hf_id": "uoft-cs/cifar10",
        "notes": """CIFAR-10 is a widely used benchmark dataset for image classification, consisting of 60,000 32x32 color images in 10 different classes.

The 10 classes are: airplane, automobile, bird, cat, deer, dog, frog, horse, ship, and truck. Each class has 6,000 images. The dataset is split into 50,000 training and 10,000 test images.

**Key Features:**
- 60,000 color images
- 32x32 pixel resolution
- 10 object classes
- Balanced dataset""",
        "author": "Alex Krizhevsky",
        "author_email": "kriz@cs.toronto.edu",
        "maintainer": "University of Toronto",
        "license_id": "other-open",
        "tags": ["image-classification", "computer-vision", "object-recognition", "deep-learning", "benchmark"],
        "task": "Image Classification",
        "modality": "Image",
        "language": "N/A",
        "size": "60K images",
        "downloads": "91K+",
        "format": "parquet"
    },
    {
        "name": "wikitext-language-modeling",
        "title": "WikiText - Language Modeling Dataset",
        "hf_id": "Salesforce/wikitext",
        "notes": """WikiText is a collection of over 100 million tokens extracted from verified Good and Featured articles on Wikipedia, designed for language modeling research.

The dataset comes in multiple versions: WikiText-2 (2M tokens) and WikiText-103 (103M tokens). It features long-term dependencies and rich vocabulary, making it ideal for testing language models.

**Key Features:**
- 100M+ tokens from Wikipedia
- High-quality curated content
- Long-term dependencies
- Large vocabulary""",
        "author": "Salesforce Research",
        "author_email": "research@salesforce.com",
        "maintainer": "Stephen Merity",
        "license_id": "cc-by-sa",
        "tags": ["language-modeling", "text-generation", "nlp", "wikipedia", "benchmark"],
        "task": "Language Modeling",
        "modality": "Text",
        "language": "English",
        "size": "100M+ tokens",
        "downloads": "846K+",
        "format": "parquet"
    },
    {
        "name": "glue-benchmark",
        "title": "GLUE - General Language Understanding Evaluation",
        "hf_id": "nyu-mll/glue",
        "notes": """GLUE (General Language Understanding Evaluation) is a multi-task benchmark and analysis platform for evaluating natural language understanding systems.

It includes diverse NLU tasks: sentiment analysis (SST-2), paraphrase detection (MRPC, QQP), natural language inference (MNLI, RTE, QNLI, WNLI), and linguistic acceptability (CoLA). GLUE is the standard benchmark for evaluating language models.

**Key Features:**
- 9 sentence-level tasks
- Diverse NLU challenges
- Standard benchmark for transformers
- Public leaderboard""",
        "author": "NYU Machine Learning Lab",
        "author_email": "bowman@nyu.edu",
        "maintainer": "Sam Bowman",
        "license_id": "other-open",
        "tags": ["benchmark", "nlp", "natural-language-understanding", "text-classification", "sentence-pair"],
        "task": "Text Classification",
        "modality": "Text",
        "language": "English",
        "size": "Multiple tasks",
        "downloads": "384K+",
        "format": "parquet"
    },
    {
        "name": "gsm8k-math-reasoning",
        "title": "GSM8K - Grade School Math Reasoning",
        "hf_id": "openai/gsm8k",
        "notes": """GSM8K is a dataset of 8,500 high-quality linguistically diverse grade school math word problems created by OpenAI.

Each problem requires 2-8 steps to solve and solutions primarily involve performing a sequence of elementary calculations using basic arithmetic operations. This dataset is crucial for evaluating mathematical reasoning in language models.

**Key Features:**
- 8,500 math word problems
- Grade school level difficulty
- Multi-step reasoning required
- Natural language solutions""",
        "author": "OpenAI",
        "author_email": "research@openai.com",
        "maintainer": "OpenAI Research",
        "license_id": "mit",
        "tags": ["math-reasoning", "question-answering", "nlp", "chain-of-thought", "reasoning"],
        "task": "Math Reasoning",
        "modality": "Text",
        "language": "English",
        "size": "8.5K problems",
        "downloads": "39K+",
        "format": "parquet"
    },
    {
        "name": "dolly-instruction-following",
        "title": "Databricks Dolly - Instruction Following Dataset",
        "hf_id": "databricks/databricks-dolly-15k",
        "notes": """Databricks Dolly 15k is an open-source dataset of instruction-following records generated by Databricks employees.

It contains 15,000 high-quality human-generated prompt/response pairs specifically designed for instruction-tuning large language models. Categories include brainstorming, classification, QA, summarization, and creative writing.

**Key Features:**
- 15,000 instruction-response pairs
- Human-generated content
- Diverse task categories
- Open-source (CC BY-SA 3.0)""",
        "author": "Databricks",
        "author_email": "oss@databricks.com",
        "maintainer": "Databricks Research",
        "license_id": "cc-by-sa",
        "tags": ["instruction-following", "text-generation", "nlp", "llm-training", "human-annotated"],
        "task": "Instruction Following",
        "modality": "Text",
        "language": "English",
        "size": "15K examples",
        "downloads": "18K+",
        "format": "parquet"
    },
    {
        "name": "ag-news-classification",
        "title": "AG News - Topic Classification Dataset",
        "hf_id": "fancyzhx/ag_news",
        "notes": """AG News is a subdataset of AG's corpus of news articles, containing 120,000 training and 7,600 test samples across four categories.

The four classes are: World, Sports, Business, and Science/Technology. Each sample consists of a title and description, making it ideal for short text classification tasks.

**Key Features:**
- 127,600 news articles
- 4 topic categories
- Title + description format
- Balanced classes""",
        "author": "AG Corpus",
        "author_email": "xiang.zhang@nyu.edu",
        "maintainer": "Xiang Zhang",
        "license_id": "other-open",
        "tags": ["text-classification", "topic-classification", "nlp", "news", "multi-class"],
        "task": "Text Classification",
        "modality": "Text",
        "language": "English",
        "size": "127K articles",
        "downloads": "56K+",
        "format": "parquet"
    }
]


def ckan_request(action, data=None, method="POST"):
    """Make a request to CKAN API."""
    url = f"{CKAN_API_URL}/{action}"
    headers = {
        "Authorization": API_TOKEN,
        "Content-Type": "application/json"
    }
    try:
        if data:
            json_data = json.dumps(data).encode('utf-8')
        else:
            json_data = None

        req = urllib.request.Request(url, data=json_data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        try:
            error_body = json.loads(e.read().decode())
            return error_body
        except:
            return {"success": False, "error": str(e)}
    except Exception as e:
        print(f"Error: {e}")
        return {"success": False, "error": str(e)}


def delete_existing_datasets():
    """Delete all existing datasets."""
    print("\n=== Deleting existing datasets ===")
    result = ckan_request("package_search", {"rows": 100})
    if result.get("success"):
        datasets = result["result"]["results"]
        for ds in datasets:
            print(f"  Deleting: {ds['name']}")
            ckan_request("package_delete", {"id": ds["id"]})
            # Purge to completely remove
            ckan_request("dataset_purge", {"id": ds["id"]})
    print(f"  Deleted {len(datasets) if result.get('success') else 0} datasets")


def ensure_organization():
    """Ensure the huggingface organization exists."""
    print("\n=== Ensuring organization exists ===")
    orgs = [
        {
            "name": "huggingface-datasets",
            "title": "Hugging Face Datasets",
            "description": "Curated datasets from Hugging Face Hub - the largest repository of ML datasets.",
            "image_url": "https://huggingface.co/front/assets/huggingface_logo.svg"
        }
    ]
    for org in orgs:
        result = ckan_request("organization_show", {"id": org["name"]})
        if not result.get("success"):
            print(f"  Creating organization: {org['name']}")
            ckan_request("organization_create", org)
        else:
            print(f"  Organization exists: {org['name']}")
    return "huggingface-datasets"


def create_datasets(org_name):
    """Create all datasets in CKAN."""
    print("\n=== Creating datasets ===")
    for ds in DATASETS:
        print(f"  Creating: {ds['name']}")

        # Create dataset
        data = {
            "name": ds["name"],
            "title": ds["title"],
            "notes": ds["notes"],
            "author": ds["author"],
            "author_email": ds["author_email"],
            "maintainer": ds["maintainer"],
            "license_id": ds["license_id"],
            "owner_org": org_name,
            "private": False,
            "tags": [{"name": tag} for tag in ds["tags"]],
            "extras": [
                {"key": "huggingface_id", "value": ds["hf_id"]},
                {"key": "task", "value": ds["task"]},
                {"key": "modality", "value": ds["modality"]},
                {"key": "language", "value": ds["language"]},
                {"key": "dataset_size", "value": ds["size"]},
                {"key": "monthly_downloads", "value": ds["downloads"]}
            ]
        }

        result = ckan_request("package_create", data)
        if result.get("success"):
            # Add a resource pointing to Hugging Face
            resource_data = {
                "package_id": result["result"]["id"],
                "name": f"{ds['title']} - Hugging Face Hub",
                "description": f"Access this dataset on Hugging Face Hub",
                "url": f"https://huggingface.co/datasets/{ds['hf_id']}",
                "format": ds["format"].upper(),
                "resource_type": "api"
            }
            ckan_request("resource_create", resource_data)
            print(f"    ✓ Created successfully")
        else:
            print(f"    ✗ Failed: {result.get('error', {}).get('message', 'Unknown error')}")


def generate_mdx_files():
    """Generate MDX documentation files for each dataset."""
    print("\n=== Generating MDX files ===")
    os.makedirs(MDX_OUTPUT_DIR, exist_ok=True)

    for ds in DATASETS:
        mdx_content = f'''---
datasetId: "{ds['name']}"
title: "{ds['title']}"
description: "{ds['notes'].split(chr(10))[0]}"
author: "{ds['author']}"
lastUpdated: "{datetime.now().strftime('%Y-%m-%d')}"
features:
  showChart: false
  showTable: true
  showDownloadButton: true
  showResources: true
huggingFaceId: "{ds['hf_id']}"
---

# Overview

{ds['notes']}

## Dataset Information

| Property | Value |
|----------|-------|
| **Task** | {ds['task']} |
| **Modality** | {ds['modality']} |
| **Language** | {ds['language']} |
| **Size** | {ds['size']} |
| **Downloads** | {ds['downloads']} monthly |
| **Format** | {ds['format']} |
| **License** | {ds['license_id'].upper()} |

## Quick Start

### Using Hugging Face Datasets Library

```python
from datasets import load_dataset

# Load the dataset
dataset = load_dataset("{ds['hf_id']}")

# Explore the dataset
print(dataset)
print(dataset["train"][0])
```

### Using Pandas

```python
import pandas as pd
from datasets import load_dataset

# Load and convert to pandas
dataset = load_dataset("{ds['hf_id']}")
df = dataset["train"].to_pandas()

# Basic exploration
print(df.head())
print(df.info())
```

## Data Structure

The dataset contains the following splits and features. Refer to the [Hugging Face Dataset Card](https://huggingface.co/datasets/{ds['hf_id']}) for detailed schema information.

## Use Cases

This dataset is commonly used for:

{generate_use_cases(ds)}

## Citation

If you use this dataset in your research, please cite it appropriately. See the [dataset page](https://huggingface.co/datasets/{ds['hf_id']}) for the recommended citation format.

## Additional Resources

- [Hugging Face Dataset Page](https://huggingface.co/datasets/{ds['hf_id']})
- [Dataset Viewer](https://huggingface.co/datasets/{ds['hf_id']}/viewer)
- [Download Options](https://huggingface.co/datasets/{ds['hf_id']}/tree/main)

---

*This dataset documentation is automatically generated from Hugging Face Hub metadata.*
'''

        mdx_path = os.path.join(MDX_OUTPUT_DIR, f"{ds['name']}.mdx")
        with open(mdx_path, 'w') as f:
            f.write(mdx_content)
        print(f"  ✓ Generated: {ds['name']}.mdx")


def generate_use_cases(ds):
    """Generate use cases based on dataset task."""
    use_cases = {
        "Text Classification": """- Sentiment analysis model training
- Text categorization benchmarking
- Transfer learning experiments
- Model fine-tuning and evaluation""",
        "Question Answering": """- Reading comprehension systems
- Information retrieval evaluation
- Chatbot development
- Knowledge extraction research""",
        "Summarization": """- Automatic summarization systems
- News digest generation
- Document compression
- Abstractive vs extractive comparison""",
        "Image Classification": """- Computer vision model training
- Deep learning benchmarking
- Transfer learning experiments
- Neural architecture evaluation""",
        "Language Modeling": """- Language model pre-training
- Perplexity benchmarking
- Text generation evaluation
- Vocabulary and embedding analysis""",
        "Math Reasoning": """- Mathematical reasoning evaluation
- Chain-of-thought prompting research
- LLM capability assessment
- Educational AI development""",
        "Instruction Following": """- Instruction-tuned model training
- Chatbot development
- LLM fine-tuning
- Human-AI interaction research"""
    }
    return use_cases.get(ds["task"], """- Machine learning research
- Model training and evaluation
- Benchmarking experiments""")


def main():
    print("=" * 60)
    print("Hugging Face Datasets Setup for CKAN")
    print("=" * 60)

    # Step 1: Delete existing datasets
    delete_existing_datasets()

    # Step 2: Ensure organization exists
    org_name = ensure_organization()

    # Step 3: Create new datasets
    create_datasets(org_name)

    # Step 4: Generate MDX files
    generate_mdx_files()

    # Clean up old MDX files
    old_mdx = os.path.join(MDX_OUTPUT_DIR, "example-dataset2.mdx")
    if os.path.exists(old_mdx):
        os.remove(old_mdx)
        print(f"\n  Removed old file: example-dataset2.mdx")

    print("\n" + "=" * 60)
    print("Setup complete!")
    print(f"Created {len(DATASETS)} datasets with MDX documentation")
    print("=" * 60)


if __name__ == "__main__":
    main()
