# Feedback: AI-Powered Public Feedback and Reporting Platform

## Overview

**Feedback** is a platform that allows citizens to report public service issues and anomalies using AI-powered tools. It provides a seamless way for users to submit photos of problems, with AI automatically categorizing the reports, summarizing the issues, and visualizing the data through analytics. This enables government bodies and public institutions to quickly identify and address pressing societal problems.

The platform consists of two components:
- **Client Interface**: The user-facing part where citizens can report problems.
- **Admin Dashboard**: The analytics interface where authorities can view data visualizations and summaries.

## Features
- AI-based image analysis and categorization.
- Automatic location detection and report submission.
- LLaMA-powered text summarization.
- Visualizations including word clouds, heatmaps, and pie charts to display data insights.

## Prerequisites
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [Python](https://www.python.org/) (version 3.7 or above)
- [Firebase](https://firebase.google.com/) account for backend setup
- [LLaMA API Key](https://llama.ai/)

## Setup Guide

### Client Interface

1. **Build Node Modules**
   ```bash
   cd client-interface
   npm install
