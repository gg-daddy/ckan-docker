#!/usr/bin/env python3
"""
Create Colab notebooks for each Hugging Face dataset and update MDX files.
"""

import json
import os
import re

NOTEBOOKS_DIR = "/Users/chenyanbin/codebase/keyrus/ckan-docker/portaljs/content/notebooks"
DATASETS_DIR = "/Users/chenyanbin/codebase/keyrus/ckan-docker/portaljs/content/datasets"

# Dataset configurations
DATASETS = {
    "imdb-sentiment-analysis": {
        "title": "IMDB Sentiment Analysis",
        "hf_id": "stanfordnlp/imdb",
        "task": "Text Classification / Sentiment Analysis",
        "description": "Analyze movie reviews and predict sentiment using the IMDB dataset.",
        "example_code": '''# View sample reviews
print("Sample positive review:")
print(dataset["train"][0]["text"][:500])
print(f"Label: {dataset["train"][0]["label"]} (0=negative, 1=positive)")

# Analyze label distribution
import collections
labels = [ex["label"] for ex in dataset["train"]]
print(f"\\nLabel distribution: {dict(collections.Counter(labels))}")''',
        "viz_code": '''# Visualize review length distribution
import matplotlib.pyplot as plt

lengths = [len(ex["text"].split()) for ex in dataset["train"][:5000]]
plt.figure(figsize=(10, 5))
plt.hist(lengths, bins=50, edgecolor='black')
plt.xlabel('Number of Words')
plt.ylabel('Frequency')
plt.title('Distribution of Review Lengths')
plt.axvline(x=sum(lengths)/len(lengths), color='red', linestyle='--', label=f'Mean: {sum(lengths)/len(lengths):.0f}')
plt.legend()
plt.show()'''
    },
    "squad-question-answering": {
        "title": "SQuAD Question Answering",
        "hf_id": "rajpurkar/squad",
        "task": "Question Answering / Reading Comprehension",
        "description": "Explore question-answer pairs from the Stanford Question Answering Dataset.",
        "example_code": '''# View a sample QA pair
sample = dataset["train"][0]
print("Context:", sample["context"][:500], "...")
print(f"\\nQuestion: {sample['question']}")
print(f"Answer: {sample['answers']['text'][0]}")
print(f"Answer start: {sample['answers']['answer_start'][0]}")''',
        "viz_code": '''# Analyze question types
import matplotlib.pyplot as plt
import collections

question_words = []
for ex in dataset["train"][:5000]:
    first_word = ex["question"].split()[0].lower()
    question_words.append(first_word)

word_counts = collections.Counter(question_words).most_common(10)
words, counts = zip(*word_counts)

plt.figure(figsize=(10, 5))
plt.bar(words, counts, color='steelblue')
plt.xlabel('Question Word')
plt.ylabel('Frequency')
plt.title('Distribution of Question Types')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()'''
    },
    "cnn-dailymail-summarization": {
        "title": "CNN/DailyMail Summarization",
        "hf_id": "abisee/cnn_dailymail",
        "config": "3.0.0",
        "task": "Text Summarization",
        "description": "Analyze news articles and their summaries from CNN and DailyMail.",
        "example_code": '''# View a sample article and its highlights
sample = dataset["train"][0]
print("Article (first 500 chars):")
print(sample["article"][:500], "...")
print(f"\\nHighlights/Summary:")
print(sample["highlights"])''',
        "viz_code": '''# Compare article vs summary lengths
import matplotlib.pyplot as plt

article_lens = [len(ex["article"].split()) for ex in dataset["train"][:2000]]
summary_lens = [len(ex["highlights"].split()) for ex in dataset["train"][:2000]]

plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.hist(article_lens, bins=50, edgecolor='black', alpha=0.7)
plt.xlabel('Words')
plt.title('Article Length Distribution')

plt.subplot(1, 2, 2)
plt.hist(summary_lens, bins=50, edgecolor='black', alpha=0.7, color='orange')
plt.xlabel('Words')
plt.title('Summary Length Distribution')
plt.tight_layout()
plt.show()

print(f"Average compression ratio: {sum(article_lens)/sum(summary_lens):.1f}x")'''
    },
    "mnist-handwritten-digits": {
        "title": "MNIST Handwritten Digits",
        "hf_id": "ylecun/mnist",
        "task": "Image Classification",
        "description": "Explore the classic MNIST dataset of handwritten digits.",
        "example_code": '''# View a sample digit
sample = dataset["train"][0]
print(f"Label: {sample['label']}")
print(f"Image shape: {sample['image'].size}")

# Display the image
from IPython.display import display
display(sample["image"])''',
        "viz_code": '''# Display a grid of sample digits
import matplotlib.pyplot as plt

fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.flat):
    sample = dataset["train"][i]
    ax.imshow(sample["image"], cmap='gray')
    ax.set_title(f"Label: {sample['label']}")
    ax.axis('off')
plt.suptitle('Sample MNIST Digits')
plt.tight_layout()
plt.show()

# Label distribution
import collections
labels = [ex["label"] for ex in dataset["train"]]
print(f"Label distribution: {dict(sorted(collections.Counter(labels).items()))}}")'''
    },
    "cifar10-image-classification": {
        "title": "CIFAR-10 Image Classification",
        "hf_id": "uoft-cs/cifar10",
        "task": "Image Classification",
        "description": "Explore the CIFAR-10 dataset with 10 classes of color images.",
        "example_code": '''# Class labels
CLASS_NAMES = ['airplane', 'automobile', 'bird', 'cat', 'deer', 
               'dog', 'frog', 'horse', 'ship', 'truck']

# View a sample image
sample = dataset["train"][0]
print(f"Label: {sample['label']} ({CLASS_NAMES[sample['label']]})")
print(f"Image shape: {sample['img'].size}")

from IPython.display import display
display(sample["img"])''',
        "viz_code": '''# Display a grid of images by class
import matplotlib.pyplot as plt

CLASS_NAMES = ['airplane', 'automobile', 'bird', 'cat', 'deer', 
               'dog', 'frog', 'horse', 'ship', 'truck']

fig, axes = plt.subplots(2, 5, figsize=(14, 6))
for label, ax in enumerate(axes.flat):
    # Find first image of this class
    for sample in dataset["train"]:
        if sample["label"] == label:
            ax.imshow(sample["img"])
            ax.set_title(CLASS_NAMES[label])
            ax.axis('off')
            break
plt.suptitle('CIFAR-10 Class Examples')
plt.tight_layout()
plt.show()'''
    },
    "wikitext-language-modeling": {
        "title": "WikiText Language Modeling",
        "hf_id": "Salesforce/wikitext",
        "config": "wikitext-2-v1",
        "task": "Language Modeling",
        "description": "Explore Wikipedia text for language modeling tasks.",
        "example_code": '''# View sample text
sample = dataset["train"][10]
print("Sample text:")
print(sample["text"][:1000])''',
        "viz_code": '''# Analyze vocabulary
import collections

all_text = " ".join([ex["text"] for ex in dataset["train"][:1000]])
words = all_text.lower().split()

word_freq = collections.Counter(words).most_common(20)
print("Top 20 words:")
for word, count in word_freq:
    print(f"  {word}: {count}")

print(f"\\nTotal tokens: {len(words)}")
print(f"Unique tokens: {len(set(words))}")'''
    },
    "glue-benchmark": {
        "title": "GLUE Benchmark (SST-2)",
        "hf_id": "nyu-mll/glue",
        "config": "sst2",
        "task": "Natural Language Understanding",
        "description": "Explore the GLUE benchmark SST-2 sentiment classification task.",
        "example_code": '''# View sample sentences
for i in range(5):
    sample = dataset["train"][i]
    sentiment = "Positive" if sample["label"] == 1 else "Negative"
    print(f"{sentiment}: {sample['sentence']}")''',
        "viz_code": '''# Label distribution
import matplotlib.pyplot as plt
import collections

labels = [ex["label"] for ex in dataset["train"]]
label_counts = collections.Counter(labels)

plt.figure(figsize=(8, 5))
plt.bar(['Negative (0)', 'Positive (1)'], 
        [label_counts[0], label_counts[1]], 
        color=['salmon', 'lightgreen'])
plt.ylabel('Count')
plt.title('SST-2 Sentiment Distribution')
for i, v in enumerate([label_counts[0], label_counts[1]]):
    plt.text(i, v + 100, str(v), ha='center')
plt.show()'''
    },
    "gsm8k-math-reasoning": {
        "title": "GSM8K Math Reasoning",
        "hf_id": "openai/gsm8k",
        "config": "main",
        "task": "Mathematical Reasoning",
        "description": "Explore grade school math problems with step-by-step solutions.",
        "example_code": '''# View a sample math problem
sample = dataset["train"][0]
print("Question:")
print(sample["question"])
print("\\nAnswer (with reasoning):")
print(sample["answer"])''',
        "viz_code": '''# Analyze answer complexity
import re

def count_steps(answer):
    # Count calculation steps (lines with <<...>>)
    return len(re.findall(r'<<.*?>>', answer))

steps = [count_steps(ex["answer"]) for ex in dataset["train"]]

import matplotlib.pyplot as plt
plt.figure(figsize=(10, 5))
plt.hist(steps, bins=range(1, max(steps)+2), edgecolor='black', align='left')
plt.xlabel('Number of Calculation Steps')
plt.ylabel('Frequency')
plt.title('Distribution of Solution Complexity')
plt.show()

print(f"Average steps: {sum(steps)/len(steps):.1f}")'''
    },
    "dolly-instruction-following": {
        "title": "Dolly Instruction Following",
        "hf_id": "databricks/databricks-dolly-15k",
        "task": "Instruction Following",
        "description": "Explore human-generated instruction-response pairs from Databricks.",
        "example_code": '''# View a sample instruction
sample = dataset["train"][0]
print(f"Category: {sample['category']}")
print(f"\\nInstruction: {sample['instruction']}")
if sample.get("context"):
    print(f"\\nContext: {sample['context'][:200]}...")
print(f"\\nResponse: {sample['response'][:500]}...")''',
        "viz_code": '''# Analyze instruction categories
import matplotlib.pyplot as plt
import collections

categories = [ex["category"] for ex in dataset["train"]]
cat_counts = collections.Counter(categories)

plt.figure(figsize=(12, 5))
plt.barh(list(cat_counts.keys()), list(cat_counts.values()), color='steelblue')
plt.xlabel('Count')
plt.title('Distribution of Instruction Categories')
for i, v in enumerate(cat_counts.values()):
    plt.text(v + 10, i, str(v), va='center')
plt.tight_layout()
plt.show()'''
    },
    "ag-news-classification": {
        "title": "AG News Classification",
        "hf_id": "fancyzhx/ag_news",
        "task": "Text Classification",
        "description": "Explore news article classification across 4 categories.",
        "example_code": '''# Class labels
CLASS_NAMES = ['World', 'Sports', 'Business', 'Sci/Tech']

# View sample articles
for i in range(4):
    sample = dataset["train"][i]
    print(f"[{CLASS_NAMES[sample['label']]}] {sample['text'][:150]}...")
    print()''',
        "viz_code": '''# Label distribution
import matplotlib.pyplot as plt
import collections

CLASS_NAMES = ['World', 'Sports', 'Business', 'Sci/Tech']

labels = [ex["label"] for ex in dataset["train"]]
label_counts = collections.Counter(labels)

plt.figure(figsize=(10, 5))
plt.bar(CLASS_NAMES, [label_counts[i] for i in range(4)], color=['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d'])
plt.ylabel('Count')
plt.title('AG News Category Distribution')
for i, v in enumerate([label_counts[i] for i in range(4)]):
    plt.text(i, v + 200, str(v), ha='center')
plt.show()'''
    }
}


def create_notebook(dataset_id, config):
    """Create a Jupyter notebook for the dataset."""
    
    load_code = f'dataset = load_dataset("{config["hf_id"]}"'
    if config.get("config"):
        load_code += f', "{config["config"]}"'
    load_code += ")"
    
    notebook = {
        "cells": [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    f"# {config['title']} - Data Explorer\n",
                    "\n",
                    f"**Task:** {config['task']}\n",
                    "\n",
                    f"{config['description']}\n",
                    "\n",
                    f"[![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/gg-daddy/ckan-docker/blob/portjs-inte/portaljs/content/notebooks/{dataset_id}.ipynb)"
                ]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": ["## 1. Setup\n", "\n", "Install required packages."]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": ["!pip install datasets pandas matplotlib -q"]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": ["## 2. Load Dataset\n", "\n", f"Load the dataset from Hugging Face: `{config['hf_id']}`"]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "from datasets import load_dataset\n",
                    "import pandas as pd\n",
                    "\n",
                    f"{load_code}\n",
                    "\n",
                    "# Display dataset info\n",
                    "print(dataset)\n",
                    "print(f\"\\nTrain samples: {len(dataset['train'])}\")"
                ]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": ["## 3. Explore Data\n", "\n", "View sample data from the dataset."]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": config["example_code"].split("\n")
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": ["## 4. Visualize Data\n", "\n", "Create visualizations to understand the data distribution."]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": config["viz_code"].split("\n")
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": ["## 5. Convert to Pandas\n", "\n", "For further analysis, convert to a pandas DataFrame."]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Convert to pandas DataFrame\n",
                    "df = dataset['train'].to_pandas()\n",
                    "\n",
                    "print(f\"DataFrame shape: {df.shape}\")\n",
                    "print(f\"\\nColumns: {list(df.columns)}\")\n",
                    "print(f\"\\nData types:\")\n",
                    "print(df.dtypes)\n",
                    "\n",
                    "df.head()"
                ]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## Next Steps\n",
                    "\n",
                    "- Train a model using this dataset\n",
                    "- Fine-tune a pretrained model\n",
                    "- Export processed data\n",
                    "- Combine with other datasets\n",
                    "\n",
                    f"For more information, visit the [Hugging Face Dataset Page](https://huggingface.co/datasets/{config['hf_id']})"
                ]
            }
        ],
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.10.0"
            },
            "colab": {
                "provenance": [],
                "toc_visible": True
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    return notebook


def update_mdx_frontmatter(dataset_id):
    """Add colabNotebook to MDX frontmatter."""
    mdx_path = os.path.join(DATASETS_DIR, f"{dataset_id}.mdx")
    
    if not os.path.exists(mdx_path):
        print(f"  MDX not found: {mdx_path}")
        return False
    
    with open(mdx_path, 'r') as f:
        content = f.read()
    
    # Check if colabNotebook already exists
    if 'colabNotebook:' in content:
        print(f"  MDX already has colabNotebook")
        return True
    
    # Find the end of frontmatter (second ---)
    parts = content.split('---', 2)
    if len(parts) < 3:
        print(f"  Invalid MDX format")
        return False
    
    # Add colabNotebook before the closing ---
    frontmatter = parts[1].rstrip()
    frontmatter += f'\ncolabNotebook: "{dataset_id}.ipynb"\n'
    
    new_content = f"---{frontmatter}---{parts[2]}"
    
    with open(mdx_path, 'w') as f:
        f.write(new_content)
    
    return True


def main():
    print("=" * 60)
    print("Creating Colab Notebooks and Updating MDX Files")
    print("=" * 60)
    
    os.makedirs(NOTEBOOKS_DIR, exist_ok=True)
    
    for dataset_id, config in DATASETS.items():
        print(f"\n{dataset_id}:")
        
        # Create notebook
        notebook = create_notebook(dataset_id, config)
        notebook_path = os.path.join(NOTEBOOKS_DIR, f"{dataset_id}.ipynb")
        
        with open(notebook_path, 'w') as f:
            json.dump(notebook, f, indent=2)
        print(f"  ✓ Created notebook: {dataset_id}.ipynb")
        
        # Update MDX
        if update_mdx_frontmatter(dataset_id):
            print(f"  ✓ Updated MDX frontmatter")
        else:
            print(f"  ✗ Failed to update MDX")
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)
    print(f"\nNotebooks created in: {NOTEBOOKS_DIR}")
    print("Colab URL format: https://colab.research.google.com/github/gg-daddy/ckan-docker/blob/portjs-inte/portaljs/content/notebooks/{dataset}.ipynb")


if __name__ == "__main__":
    main()
