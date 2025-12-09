#!/usr/bin/env python3
"""
Unified Quality Dashboard - Generates comprehensive quality dashboard
Combines all BMad + DOE quality metrics into single view
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List

class UnifiedQualityDashboard:
    """
    Generates unified quality dashboard showing:
    - BMad quality gates
    - DOE quality metrics
    - Combined status
    - Trends over time
    """
    
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.stories_dir = os.path.join(self.project_root, 'docs', 'stories')
        self.gates_dir = os.path.join(self.project_root, 'docs', 'qa', 'gates')
    
    def collect_metrics(self, epic_id: str = None) -> Dict:
        """
        Collect all quality metrics for epic or entire project
        """
        print(f"📊 Collecting Quality Metrics...")
        
        metrics = {
            'timestamp': datetime.now().isoformat(),
            'epic': epic_id or 'all',
            'stories': [],
            'summary': {
                'total_stories': 0,
                'bmad_gates': {'PASS': 0, 'CONCERNS': 0, 'FAIL': 0, 'PENDING': 0},
                'avg_doe_qa_score': 0,
                'avg_code_quality': 0,
                'avg_test_coverage': 0,
                'combined_pass_rate': 0
            }
        }
        
        # In full implementation, would scan story files and gates
        # For now, return structure
        
        return metrics
    
    def generate_dashboard_markdown(self, metrics: Dict) -> str:
        """
        Generate dashboard as markdown
        """
        dashboard = f"""# 📊 Unified Quality Dashboard

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Epic**: {metrics['epic']}

## 🎯 Overall Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Stories | {metrics['summary']['total_stories']} | - |
| Combined Pass Rate | {metrics['summary']['combined_pass_rate']:.1f}% | {'✅' if metrics['summary']['combined_pass_rate'] >= 90 else '⚠️'} |
| Avg QA Score | {metrics['summary']['avg_doe_qa_score']:.1f}/100 | {'✅' if metrics['summary']['avg_doe_qa_score'] >= 90 else '⚠️'} |
| Avg Code Quality | {metrics['summary']['avg_code_quality']:.1f}/100 | {'✅' if metrics['summary']['avg_code_quality'] >= 85 else '⚠️'} |
| Avg Test Coverage | {metrics['summary']['avg_test_coverage']:.1f}% | {'✅' if metrics['summary']['avg_test_coverage'] >= 80 else '⚠️'} |

## 🏁 BMad Quality Gates

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ PASS | {metrics['summary']['bmad_gates']['PASS']} | {metrics['summary']['bmad_gates']['PASS'] / max(metrics['summary']['total_stories'], 1) * 100:.1f}% |
| ⚠️  CONCERNS | {metrics['summary']['bmad_gates']['CONCERNS']} | {metrics['summary']['bmad_gates']['CONCERNS'] / max(metrics['summary']['total_stories'], 1) * 100:.1f}% |
| ❌ FAIL | {metrics['summary']['bmad_gates']['FAIL']} | {metrics['summary']['bmad_gates']['FAIL'] / max(metrics['summary']['total_stories'], 1) * 100:.1f}% |
| ⏳ PENDING | {metrics['summary']['bmad_gates']['PENDING']} | {metrics['summary']['bmad_gates']['PENDING'] / max(metrics['summary']['total_stories'], 1) * 100:.1f}% |

## 📈 DOE Metrics Breakdown

### QA Score Distribution
```
≥95:  ███████ {0} stories
90-94: ████   {0} stories
85-89: ██     {0} stories
80-84: █      {0} stories
<80:  ▁      {0} stories
```

### Code Quality Distribution
```
≥95:  ███████ {0} stories
90-94: ████   {0} stories
85-89: ██     {0} stories
80-84: █      {0} stories
<80:  ▁      {0} stories
```

### Test Coverage Distribution
```
≥95%:  ███████ {0} stories
90-94%: ████   {0} stories
85-89%: ██     {0} stories
80-84%: █      {0} stories
<80%:  ▁      {0} stories
```

## 📋 Story Details

| Story | BMad Gate | QA Score | Code Quality | Coverage | Combined |
|-------|-----------|----------|--------------|----------|----------|
"""
        
        for story in metrics['stories']:
            dashboard += f"| {story.get('name', 'N/A')} "
            dashboard += f"| {story.get('bmad_gate', 'PENDING')} "
            dashboard += f"| {story.get('qa_score', 0)}/100 "
            dashboard += f"| {story.get('code_quality', 0)}/100 "
            dashboard += f"| {story.get('coverage', 0)}% "
            dashboard += f"| {story.get('combined_status', '⏳')} |\n"
        
        if not metrics['stories']:
            dashboard += "| No stories assessed yet | - | - | - | - | - |\n"
        
        dashboard += f"""

## 🎯 Quality Trends

*Coming soon: Historical trend analysis*

## 🔍 Insights & Recommendations

"""
        
        # Add insights based on metrics
        if metrics['summary']['avg_doe_qa_score'] < 90:
            dashboard += "- ⚠️  Average QA score below threshold - focus on test coverage and bug fixes\n"
        
        if metrics['summary']['bmad_gates']['FAIL'] > 0:
            dashboard += f"- ❌ {metrics['summary']['bmad_gates']['FAIL']} stories with FAIL gate - address critical issues\n"
        
        if metrics['summary']['bmad_gates']['CONCERNS'] > 0:
            dashboard += f"- ⚠️  {metrics['summary']['bmad_gates']['CONCERNS']} stories with CONCERNS - review recommendations\n"
        
        if metrics['summary']['combined_pass_rate'] >= 90:
            dashboard += "- ✅ Excellent combined pass rate - quality standards being met\n"
        
        dashboard += """

## 📊 How to Improve

1. **For stories with FAIL gate**: Run `@qa *review` and address critical issues
2. **For low QA scores**: Focus on acceptance criteria completion and testing
3. **For low code quality**: Review coding standards and refactor
4. **For low coverage**: Add missing unit and integration tests

---

*Dashboard generated by Unified Quality Dashboard*  
*Refresh: `python execution/quality_dashboard.py --epic {epic_id}`*
"""
        
        return dashboard
    
    def generate_dashboard(self, epic_id: str = None, output_file: str = None) -> str:
        """
        Generate complete quality dashboard
        """
        metrics = self.collect_metrics(epic_id)
        dashboard = self.generate_dashboard_markdown(metrics)
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(dashboard)
            print(f"✅ Dashboard saved to: {output_file}")
        
        return dashboard

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Unified Quality Dashboard Generator')
    parser.add_argument('--epic', type=str,
                       help='Epic ID to generate dashboard for (e.g., epic-1)')
    parser.add_argument('--output', type=str,
                       default='docs/quality-dashboard.md',
                       help='Output file for dashboard')
    parser.add_argument('--json', action='store_true',
                       help='Output metrics as JSON')
    
    args = parser.parse_args()
    
    dashboard_gen = UnifiedQualityDashboard()
    
    if args.json:
        metrics = dashboard_gen.collect_metrics(args.epic)
        print(json.dumps(metrics, indent=2))
    else:
        dashboard = dashboard_gen.generate_dashboard(args.epic, args.output)
        print(dashboard)

if __name__ == '__main__':
    main()
