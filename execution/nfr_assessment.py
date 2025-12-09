#!/usr/bin/env python3
"""
NFR Assessment Automation - Automates Non-Functional Requirements checking
Integrates BMad NFR assessment dengan DOE quality checks
"""

import os
import sys
import json
from pathlib import Path
from typing import Dict, List
from datetime import datetime

class NFRAssessmentAutomation:
    """
    Automates NFR (Non-Functional Requirements) assessment
    Combines BMad NFR categories dengan DOE automated checks
    """
    
    # NFR Categories from BMad
    NFR_CATEGORIES = {
        'security': [
            'Authentication implemented correctly',
            'Authorization guards in place',
            'Input validation present',
            'SQL injection protection',
            'XSS protection',
            'Sensitive data encrypted'
        ],
        'performance': [
            'Database queries optimized',
            'Indexing strategy implemented',
            'Response times acceptable (<200ms)',
            'No N+1 query problems',
            'Caching implemented where appropriate',
            'Pagination for large datasets'
        ],
        'reliability': [
            'Error handling implemented',
            'Graceful degradation',
            'Transaction management',
            'Data validation',
            'Retry logic for external calls',
            'Proper logging'
        ],
        'maintainability': [
            'Code follows standards',
            'Proper documentation',
            'Clear naming conventions',
            'Low cyclomatic complexity',
            'DRY principles followed',
            'SOLID principles followed'
        ]
    }
    
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.results = {
            'security': {'score': 0, 'checks': []},
            'performance': {'score': 0, 'checks': []},
            'reliability': {'score': 0, 'checks': []},
            'maintainability': {'score': 0, 'checks': []}
        }
    
    def check_security(self, files: List[str]) -> Dict:
        """
        Check security NFRs
        In full implementation, would scan code for patterns
        """
        print("🔒 Checking Security NFRs...")
        
        checks = []
        for check in self.NFR_CATEGORIES['security']:
            # Placeholder - would perform actual checks
            checks.append({
                'item': check,
                'status': 'PENDING',
                'evidence': 'Manual verification required'
            })
        
        score = 0  # Would calculate based on actual checks
        
        return {
            'score': score,
            'checks': checks,
            'status': 'PENDING'
        }
    
    def check_performance(self, files: List[str]) -> Dict:
        """
        Check performance NFRs
        Would analyze queries, response times, etc.
        """
        print("⚡ Checking Performance NFRs...")
        
        checks = []
        for check in self.NFR_CATEGORIES['performance']:
            checks.append({
                'item': check,
                'status': 'PENDING',
                'evidence': 'Performance testing required'
            })
        
        score = 0
        
        return {
            'score': score,
            'checks': checks,
            'status': 'PENDING'
        }
    
    def check_reliability(self, files: List[str]) -> Dict:
        """
        Check reliability NFRs
        Would analyze error handling, transactions, etc.
        """
        print("🛡️ Checking Reliability NFRs...")
        
        checks = []
        for check in self.NFR_CATEGORIES['reliability']:
            checks.append({
                'item': check,
                'status': 'PENDING',
                'evidence': 'Code review required'
            })
        
        score = 0
        
        return {
            'score': score,
            'checks': checks,
            'status': 'PENDING'
        }
    
    def check_maintainability(self, files: List[str]) -> Dict:
        """
        Check maintainability NFRs
        Would run code quality tools
        """
        print("🔧 Checking Maintainability NFRs...")
        
        checks = []
        for check in self.NFR_CATEGORIES['maintainability']:
            checks.append({
                'item': check,
                'status': 'PENDING',
                'evidence': 'Code quality analysis required'
            })
        
        score = 0
        
        return {
            'score': score,
            'checks': checks,
            'status': 'PENDING'
        }
    
    def run_full_assessment(self, story_file: str, changed_files: List[str]) -> Dict:
        """
        Run complete NFR assessment
        """
        print(f"\n{'='*60}")
        print(f"🎯 Running NFR Assessment for {Path(story_file).name}")
        print(f"{'='*60}\n")
        
        # Run all category checks
        results = {
            'story': story_file,
            'timestamp': datetime.now().isoformat(),
            'files_checked': changed_files,
            'assessments': {
                'security': self.check_security(changed_files),
                'performance': self.check_performance(changed_files),
                'reliability': self.check_reliability(changed_files),
                'maintainability': self.check_maintainability(changed_files)
            }
        }
        
        # Calculate overall score
        total_score = sum(
            results['assessments'][cat]['score'] 
            for cat in results['assessments']
        )
        avg_score = total_score / len(results['assessments']) if results['assessments'] else 0
        
        # Determine overall status
        if avg_score >= 90:
            overall_status = "✅ EXCELLENT"
        elif avg_score >= 75:
            overall_status = "✅ GOOD"
        elif avg_score >= 60:
            overall_status = "⚠️  ACCEPTABLE"
        else:
            overall_status = "❌ NEEDS IMPROVEMENT"
        
        results['overall'] = {
            'score': avg_score,
            'status': overall_status
        }
        
        print(f"\n{'='*60}")
        print(f"📊 Overall NFR Score: {avg_score:.1f}/100")
        print(f"🏁 Status: {overall_status}")
        print(f"{'='*60}\n")
        
        return results
    
    def generate_nfr_report(self, assessment: Dict, output_file: str = None) -> str:
        """
        Generate detailed NFR assessment report
        """
        report = f"""# NFR Assessment Report

**Story**: {Path(assessment['story']).name}  
**Timestamp**: {assessment['timestamp']}  
**Overall Score**: {assessment['overall']['score']:.1f}/100  
**Status**: {assessment['overall']['status']}

## Files Assessed

{chr(10).join(f"- {f}" for f in assessment['files_checked'])}

## Category Assessments

"""
        
        for category, data in assessment['assessments'].items():
            report += f"### {category.title()}\n\n"
            report += f"**Score**: {data['score']}/100  \n"
            report += f"**Status**: {data['status']}\n\n"
            report += "**Checks**:\n\n"
            
            for check in data['checks']:
                status_icon = "✅" if check['status'] == 'PASS' else "⚠️" if check['status'] == 'PENDING' else "❌"
                report += f"- {status_icon} {check['item']}\n"
                if check['evidence']:
                    report += f"  - *{check['evidence']}*\n"
            
            report += "\n"
        
        report += """
## Recommendations

BMad QA agent should review:
1. Run `@qa *nfr {story}` for comprehensive assessment
2. Address any PENDING items
3. Verify automated check findings
4. Update assessment based on manual review

---

*Generated by NFR Assessment Automation*
"""
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"📄 NFR Report saved to: {output_file}")
        
        return report

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='NFR Assessment Automation')
    parser.add_argument('--story', type=str, required=True,
                       help='Path to story file')
    parser.add_argument('--files', type=str, nargs='+',
                       help='Changed files to assess')
    parser.add_argument('--report', type=str,
                       help='Output file for NFR report')
    parser.add_argument('--json', action='store_true',
                       help='Output as JSON')
    
    args = parser.parse_args()
    
    assessor = NFRAssessmentAutomation()
    
    files_to_check = args.files or []
    results = assessor.run_full_assessment(args.story, files_to_check)
    
    if args.json:
        print(json.dumps(results, indent=2))
    elif args.report:
        assessor.generate_nfr_report(results, args.report)
    else:
        print("\n💡 To generate report, use --report flag")
        print(f"   python execution/nfr_assessment.py --story {args.story} --report nfr-report.md")

if __name__ == '__main__':
    main()
