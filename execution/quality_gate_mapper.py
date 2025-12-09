#!/usr/bin/env python3
"""
Quality Gate Mapper - Maps BMad quality gates to DOE scoring system
Provides unified quality assessment combining both frameworks
"""

import os
import sys
import json
import yaml
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

class QualityGateMapper:
    """
    Combines BMad quality gate decisions dengan DOE quality metrics
    untuk unified quality assessment
    """
    
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.gates_dir = os.path.join(self.project_root, 'docs', 'qa', 'gates')
        self.config_file = os.path.join(self.project_root, '.agent-config.json')
        
        # Load config
        self.config = self._load_config()
        self.thresholds = self.config.get('bmad_integration', {}).get(
            'quality_integration', {}).get('combined_threshold', {})
    
    def _load_config(self) -> Dict:
        """Load agent configuration"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def read_bmad_gate(self, story_file: str) -> Optional[Dict]:
        """
        Read BMad quality gate file for story
        Returns gate data or None if not found
        """
        story_name = Path(story_file).stem
        
        # Search for gate file matching story
        if not os.path.exists(self.gates_dir):
            print(f"⚠️  Gates directory not found: {self.gates_dir}")
            return None
        
        for gate_file in os.listdir(self.gates_dir):
            if story_name in gate_file and gate_file.endswith('.yml'):
                gate_path = os.path.join(self.gates_dir, gate_file)
                with open(gate_path, 'r', encoding='utf-8') as f:
                    return yaml.safe_load(f)
        
        print(f"⚠️  No gate file found for story: {story_name}")
        return None
    
    def calculate_doe_metrics(self, story_file: str) -> Dict:
        """
        Calculate DOE quality metrics
        In full implementation, this would run actual checks
        """
        # Placeholder - would run actual metrics
        return {
            'qa_score': 0,  # Would run QA scoring
            'code_quality': 0,  # Would run code quality checker
            'test_coverage': 0,  # Would read coverage report
            'error_count': 0  # Would check error logs
        }
    
    def map_gate_to_score(self, gate_status: str) -> int:
        """
        Map BMad gate status to numerical score (0-100)
        """
        gate_mapping = {
            'PASS': 100,
            'CONCERNS': 75,
            'FAIL': 50,
            'WAIVED': 85  # Lower than PASS but acceptable
        }
        return gate_mapping.get(gate_status.upper(), 0)
    
    def check_combined_gate(self, story_file: str) -> Dict:
        """
        Check if story passes combined quality gate
        Combines BMad gate + DOE metrics
        """
        print(f"🎯 Checking Combined Quality Gate for {story_file}...")
        print("=" * 60)
        
        # Read BMad gate
        bmad_gate_data = self.read_bmad_gate(story_file)
        bmad_gate_status = 'PENDING'
        bmad_score = 0
        
        if bmad_gate_data:
            bmad_gate_status = bmad_gate_data.get('decision', 'PENDING')
            bmad_score = self.map_gate_to_score(bmad_gate_status)
            print(f"✅ BMad Gate: {bmad_gate_status} (Score: {bmad_score}/100)")
        else:
            print("⚠️  BMad Gate: NOT FOUND (run @qa *review first)")
        
        # Calculate DOE metrics
        doe_metrics = self.calculate_doe_metrics(story_file)
        print(f"\n📊 DOE Metrics:")
        print(f"   QA Score: {doe_metrics['qa_score']}/100")
        print(f"   Code Quality: {doe_metrics['code_quality']}/100")
        print(f"   Test Coverage: {doe_metrics['test_coverage']}%")
        
        # Check against thresholds
        print(f"\n🎯 Required Thresholds:")
        print(f"   BMad Gate: {self.thresholds.get('bmad_gate', 'PASS')}")
        print(f"   DOE QA Score: ≥{self.thresholds.get('doe_qa_score', 90)}")
        print(f"   Code Quality: ≥{self.thresholds.get('doe_code_quality', 85)}")
        print(f"   Test Coverage: ≥{self.thresholds.get('doe_test_coverage', 80)}%")
        
        # Calculate combined result
        passes = {
            'bmad_gate': bmad_gate_status == self.thresholds.get('bmad_gate', 'PASS'),
            'doe_qa_score': doe_metrics['qa_score'] >= self.thresholds.get('doe_qa_score', 90),
            'doe_code_quality': doe_metrics['code_quality'] >= self.thresholds.get('doe_code_quality', 85),
            'doe_test_coverage': doe_metrics['test_coverage'] >= self.thresholds.get('doe_test_coverage', 80)
        }
        
        all_pass = all(passes.values())
        
        # Determine overall status
        if all_pass:
            overall_status = "✅ PASS"
            recommendation = "Ready for production deployment"
        elif bmad_gate_status == 'FAIL' or doe_metrics['qa_score'] < 70:
            overall_status = "❌ FAIL"
            recommendation = "Must address critical issues before proceeding"
        else:
            overall_status = "⚠️  CONCERNS"
            recommendation = "Review issues and consider fixes"
        
        result = {
            'story': story_file,
            'timestamp': datetime.now().isoformat(),
            'bmad_gate': {
                'status': bmad_gate_status,
                'score': bmad_score,
                'passes': passes['bmad_gate']
            },
            'doe_metrics': {
                'qa_score': doe_metrics['qa_score'],
                'code_quality': doe_metrics['code_quality'],
                'test_coverage': doe_metrics['test_coverage'],
                'passes_qa': passes['doe_qa_score'],
                'passes_quality': passes['doe_code_quality'],
                'passes_coverage': passes['doe_test_coverage']
            },
            'combined': {
                'status': overall_status,
                'all_criteria_met': all_pass,
                'recommendation': recommendation
            },
            'failures': [k for k, v in passes.items() if not v]
        }
        
        print(f"\n{'='*60}")
        print(f"🏁 Combined Result: {overall_status}")
        print(f"📝 Recommendation: {recommendation}")
        
        if result['failures']:
            print(f"\n❌ Failed Criteria:")
            for failure in result['failures']:
                print(f"   - {failure}")
        
        print("=" * 60)
        
        return result
    
    def generate_quality_report(self, story_file: str, output_file: Optional[str] = None) -> str:
        """
        Generate comprehensive quality report
        Combines BMad assessment + DOE metrics
        """
        result = self.check_combined_gate(story_file)
        
        report = f"""# Quality Report: {Path(story_file).name}

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

**Combined Status**: {result['combined']['status']}  
**Recommendation**: {result['combined']['recommendation']}

## BMad Quality Gate

- **Status**: {result['bmad_gate']['status']}
- **Score**: {result['bmad_gate']['score']}/100
- **Threshold**: {self.thresholds.get('bmad_gate', 'PASS')}
- **Passes**: {'✅ Yes' if result['bmad_gate']['passes'] else '❌ No'}

## DOE Quality Metrics

### QA Score
- **Score**: {result['doe_metrics']['qa_score']}/100
- **Threshold**: ≥{self.thresholds.get('doe_qa_score', 90)}
- **Passes**: {'✅ Yes' if result['doe_metrics']['passes_qa'] else '❌ No'}

### Code Quality
- **Score**: {result['doe_metrics']['code_quality']}/100
- **Threshold**: ≥{self.thresholds.get('doe_code_quality', 85)}
- **Passes**: {'✅ Yes' if result['doe_metrics']['passes_quality'] else '❌ No'}

### Test Coverage
- **Coverage**: {result['doe_metrics']['test_coverage']}%
- **Threshold**: ≥{self.thresholds.get('doe_test_coverage', 80)}%
- **Passes**: {'✅ Yes' if result['doe_metrics']['passes_coverage'] else '❌ No'}

## Combined Decision

**All Criteria Met**: {'✅ Yes' if result['combined']['all_criteria_met'] else '❌ No'}

"""
        
        if result['failures']:
            report += "\n### Failed Criteria\n\n"
            for failure in result['failures']:
                report += f"- ❌ {failure}\n"
        
        report += "\n---\n\n*Report generated by Quality Gate Mapper*\n"
        
        # Save report if output file specified
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"\n📄 Report saved to: {output_file}")
        
        return report

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='BMad + DOE Quality Gate Mapper')
    parser.add_argument('--story', type=str, required=True,
                       help='Path to story file')
    parser.add_argument('--report', type=str,
                       help='Output file for quality report')
    parser.add_argument('--json', action='store_true',
                       help='Output result as JSON')
    
    args = parser.parse_args()
    
    mapper = QualityGateMapper()
    
    if args.json:
        result = mapper.check_combined_gate(args.story)
        print("\n" + json.dumps(result, indent=2))
    elif args.report:
        report = mapper.generate_quality_report(args.story, args.report)
    else:
        mapper.check_combined_gate(args.story)

if __name__ == '__main__':
    main()
