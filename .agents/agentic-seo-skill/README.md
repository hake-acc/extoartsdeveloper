# Agentic SEO Skill

## Source

- **Repository:** https://github.com/Bhanunamikaze/Agentic-SEO-Skill
- **Commit hash:** `69199160e18372bc5cdf9ddec20ccb9fb1b509f1`
- **Installation date:** 2026-07-16

---

## Overview

LLM-first SEO analysis skill with 16 specialized sub-skills, 10 specialist agents, and 89+ scripts for website, blog, and GitHub repository optimization. Entry point: `SKILL.md`.

---

## Files Copied

### Root
- `SKILL.md` — main skill entry point and orchestration logic
- `requirements.txt` — Python dependency list
- `.env.example` — template for optional API credentials

### `resources/agents/` — Specialist agent prompt files
- `seo-content.md`
- `seo-github-analyst.md`
- `seo-github-benchmark.md`
- `seo-github-data.md`
- `seo-performance.md`
- `seo-schema.md`
- `seo-sitemap.md`
- `seo-technical.md`
- `seo-verifier.md`
- `seo-visual.md`

### `resources/config/`
- `scoring.json` — category scoring weights

### `resources/references/` — SEO standards and rubrics
- `cwv-thresholds.md`
- `eeat-framework.md`
- `github-api-ops.md`
- `github-ranking-factors.md`
- `google-seo-reference.md`
- `link-building.md`
- `llm-audit-rubric.md`
- `quality-gates.md`
- `readme-audit-rubric.md`
- `schema-types.md`

### `resources/schema/`
- `templates.json` — pre-built JSON-LD schema templates

### `resources/skills/` — Sub-skill instruction files
- `seo-aeo.md`, `seo-article.md`, `seo-audit.md`, `seo-competitor-pages.md`
- `seo-content.md`, `seo-geo.md`, `seo-github.md`, `seo-hreflang.md`
- `seo-images.md`, `seo-links.md`, `seo-page.md`, `seo-plan.md`
- `seo-programmatic.md`, `seo-schema.md`, `seo-sitemap.md`, `seo-technical.md`

### `resources/templates/` — Industry-specific SEO plan templates
- `agency.md`, `blog-post.md`, `ecommerce.md`, `generic.md`
- `github-seo-report.md`, `github-weekly-scorecard.md`, `local-service.md`
- `news-article.md`, `publisher.md`, `saas.md`, `technical-article.md`

### `scripts/` — 91 Python analysis scripts + shell hook
- Core: `fetch_page.py`, `parse_html.py`, `generate_report.py`, `audit_runner.py`, `seo_common.py`, `env_loader.py`
- Technical: `robots_checker.py`, `robots_path_tester.py`, `canonical_checker.py`, `redirect_checker.py`, `redirect_backlink_reclaim.py`, `security_headers.py`, `indexability_matrix.py`, `javascript_render_audit.py`, `mobile_render_checker.py`, `cache_compression_checker.py`, `x_robots_header_checker.py`, `indexnow_checker.py`, `critical_request_chain.py`, `third_party_script_audit.py`, `url_quality.py`
- Performance: `pagespeed.py`, `lcp_subparts.py`, `lighthouse_runner.py`, `font_audit.py`, `image_weight_audit.py`
- Content: `readability.py`, `article_seo.py`, `content_decay_detector.py`, `content_intent_matcher.py`, `duplicate_content.py`, `freshness_checker.py`, `answer_block_scanner.py`, `citation_readiness.py`, `eeat_signal_checker.py`, `entity_checker.py`, `log_file_analyzer.py`, `topical_cluster_mapper.py`
- Links: `broken_links.py`, `internal_links.py`, `external_link_quality.py`, `anchor_text_audit.py`, `link_profile.py`, `orphan_pages_from_sitemap.py`
- Schema: `validate_schema.py`, `schema_diff.py`, `schema_required_props.py`, `schema_template_generator.py`, `review_schema_checker.py`, `product_schema_checker.py`, `video_schema_checker.py`, `collection_page_checker.py`, `rich_results_guard.py`
- Sitemap: `sitemap_checker.py`, `sitemap_generator.py`, `hreflang_checker.py`, `hreflang_sitemap_validator.py`
- Social/Meta: `social_meta.py`, `a11y_seo_checker.py`
- GEO/AI: `llms_txt_checker.py`, `llms_txt_generator.py`, `ai_crawler_policy_matrix.py`
- Local: `local_seo_checker.py`, `faceted_nav_audit.py`
- Competitive: `competitor_gap.py`, `crawl_audit.py`
- GitHub: `github_api.py`, `github_repo_audit.py`, `github_readme_lint.py`, `github_community_health.py`, `github_search_benchmark.py`, `github_competitor_research.py`, `github_traffic_archiver.py`, `github_seo_report.py`, `github_weekly_scorecard.py`, `repo_docs_site_checker.py`, `repo_file_inventory.py`, `repo_release_seo.py`, `repo_social_preview_checker.py`, `repo_topic_suggester.py`
- Visual: `capture_screenshot.py`, `analyze_visual.py`, `visual_regression_snapshot.py`
- Verification: `finding_verifier.py`, `gsc_checker.py`, `reference_freshness.py`, `validate_skill_inventory.py`
- Reporting: `generate_report.py`
- CI/CD: `pre_commit_seo_check.sh`
- Library: `lib/__init__.py`, `lib/safe_http.py`
- Modules: `__init__.py`

---

## Dependencies and Prerequisites

### Required (for network/HTML scripts)
```bash
pip install requests beautifulsoup4 lxml
```

### Optional
| Package | Used by |
|---------|---------|
| `playwright` | `capture_screenshot.py`, `analyze_visual.py` (visual audits) |
| `google-auth`, `google-api-python-client` | `gsc_checker.py` (Google Search Console) |

### API credentials (optional)
Copy `.env.example` to `.env` in your working directory and fill in only the keys you have:
- `PAGESPEED_API_KEY` — PageSpeed Insights (works without key, higher quota with)
- `GITHUB_TOKEN` / `GH_TOKEN` — GitHub API (required for private repos or high-volume audits)
- `GOOGLE_SEARCH_CONSOLE_*` — GSC integration

### Python version
Python 3.8 or higher required.

---

## Usage

Future agents should set `<SKILL_DIR>` to the absolute path of this directory (`.agents/agentic-seo-skill/`) when invoking scripts. Read `SKILL.md` for full orchestration instructions and available commands.

---

## Files Excluded

The following were intentionally omitted to minimize size:
- `docs/images/` — screenshots and example output images
- `tests/` — test suite and fixtures
- `wiki/` — GitHub wiki documentation
- `.github/` — CI/CD workflows, issue templates
- `CHANGELOG.md`, `CITATION.cff`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `LICENSE` — project meta files
- `install.sh`, `install.ps1` — installation scripts (not needed for skill use)
- `pyproject.toml` — build/dev tooling config
- `improvements.md` — roadmap notes
