# Dataset MDX Content

This directory contains MDX files that provide rich documentation for CKAN datasets.

## File Naming Convention

MDX files should be named to match the CKAN dataset ID/name:

```
content/datasets/
├── my-dataset.mdx         → matches CKAN dataset ID "my-dataset"
├── weather-data.mdx       → matches CKAN dataset ID "weather-data"
└── open-data-2024.mdx     → matches CKAN dataset ID "open-data-2024"
```

## MDX File Structure

Each MDX file should include frontmatter and markdown content:

```mdx
---
datasetId: "my-dataset"
title: "My Dataset Documentation"
description: "Optional description"
author: "Author Name"
lastUpdated: "2024-12-26"
---

# Overview

Your dataset documentation here...

## Usage Examples

\`\`\`python
# Code examples
import pandas as pd
\`\`\`
```

## Frontmatter Options

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `datasetId` | string | Recommended | CKAN dataset ID (should match filename) |
| `title` | string | Optional | Override dataset title |
| `description` | string | Optional | Short description |
| `author` | string | Optional | Content author |
| `lastUpdated` | string | Optional | Last update date |
| `features` | object | Optional | Display feature flags |
| `relatedDatasets` | array | Optional | List of related dataset IDs |

## Fallback Behavior

If no MDX file exists for a dataset, PortalJS will display:
- Dataset title and description from CKAN
- Resource list with download links
- Standard metadata (organization, tags, etc.)
