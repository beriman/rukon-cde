#!/usr/bin/env python3
"""
Automated Gate Checker - Runs on story completion
Automatically checks combined quality gate and notifies of status
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

# Import our quality tools
sys.path.insert(0, os.path.dirname(__file__))
from quality_gate_mapper import QualityGateMapper
from nfr_assessment import NFRAssessmentAutomation

class AutomatedGateChecker:
    """
    Automated quality gate checking system
    Runs automatically when story marked complete
    """
    
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.gate_mapper = QualityGateMapper(project_root)
        self.nfr_assessor = NFRAssessmentAutomation(project_root)
    
    def check_story_status(self, story_file: str) -> str:
        """
        Check if story is marked as ready for review
        """
        if not os.path.exists(story_file):
            return 'NOT_FOUND'
        
        with open(story_file, 'r', encoding='utf-8') as f:
            content = f.read().lower()
        
        if 'ready for review' in content or 'status: complete' in content:
            return 'READY'
        elif 'in progress' in content:
            return 'IN_PROGRESS'
        else:
            return 'DRAFT'
    
    def run_automated_checks(self, story_file: str, changed_files: List[str] = None) -> Dict:
        """
        Run all automated quality checks
        """
        print(f"\n{'='*70}")
        print(f"🤖 AUTOMATED GATE CHECKER")
        print(f"{'='*70}\n")
        print(f"📄 Story: {Path(story_file).name}")
        print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"\n{'='*70}\n")
        
        # Check story status
        story_status = self.check_story_status(story_file)
        print(f"📊 Story Status: {story_status}")
        
        if story_status != 'READY':
            print(f"\n⚠️  Story not ready for review (Status: {story_status})")
            print(f"   Mark story as 'Ready for Review' to trigger automated checks")
            return {
                'story': story_file,
                'status': story_status,
                'checks_run': False,
                'message': 'Story not ready for automated checks'
            }
        
        print(f"\n✅ Story marked ready - running automated checks...\n")
        
        # Run quality gate check
        print("=" * 70)
        gate_result = self.gate_mapper.check_combined_gate(story_file)
        
        # Run NFR assessment if files provided
        nfr_result = None
        if changed_files:
            print("\n" + "=" * 70)
            nfr_result = self.nfr_assessor.run_full_assessment(story_file, changed_files)
        
        # Compile results
        results = {
            'story': story_file,
            'timestamp': datetime.now().isoformat(),
            'story_status': story_status,
            'checks_run': True,
            'quality_gate': gate_result,
            'nfr_assessment': nfr_result,
            'overall_recommendation': self._generate_recommendation(gate_result, nfr_result)
        }
        
        # Print summary
        self._print_summary(results)
        
        return results
    
    def _generate_recommendation(self, gate_result: Dict, nfr_result: Dict = None) -> str:
        """
        Generate overall recommendation based on all checks
        """
        gate_status = gate_result['combined']['status']
        
        if '✅' in gate_status and gate_result['combined']['all_criteria_met']:
            if nfr_result and nfr_result['overall']['score'] >= 75:
                return "✅ APPROVED - All criteria met, ready for production"
            elif nfr_result:
                return "⚠️  APPROVED WITH CONCERNS - Gate passed but NFR scores could be improved"
            else:
                return "✅ APPROVED - All criteria met, ready for production"
        
        elif '⚠️' in gate_status:
            return "⚠️  NEEDS REVIEW - Some concerns identified, review recommended before deploy"
        
        else:
            return "❌ BLOCKED - Critical issues must be addressed before proceeding"
    
    def _print_summary(self, results: Dict):
        """
        Print summary of automated check results
        """
        print(f"\n{'='*70}")
        print(f"📋 AUTOMATED CHECK SUMMARY")
        print(f"{'='*70}\n")
        
        gate = results['quality_gate']
        print(f"🏁 Combined Quality Gate: {gate['combined']['status']}")
        print(f"   - BMad Gate: {gate['bmad_gate']['status']}")
        print(f"   - DOE QA Score: {gate['doe_metrics']['qa_score']}/100")
        print(f"   - Code Quality: {gate['doe_metrics']['code_quality']}/100")
        print(f"   - Test Coverage: {gate['doe_metrics']['test_coverage']}%")
        
        if results['nfr_assessment']:
            nfr = results['nfr_assessment']
            print(f"\n🔍 NFR Assessment: {nfr['overall']['status']}")
            print(f"   - Overall Score: {nfr['overall']['score']:.1f}/100")
        
        print(f"\n🎯 Recommendation: {results['overall_recommendation']}")
        print(f"\n{'='*70}\n")
    
    def save_results(self, results: Dict, output_file: str = None):
        """
        Save automated check results to file
        """
        if not output_file:
            story_name = Path(results['story']).stem
            output_file = f"docs/qa/automated-checks/{story_name}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)
        
        print(f"💾 Results saved to: {output_file}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Automated Quality Gate Checker')
    parser.add_argument('--story', type=str, required=True,
                       help='Path to story file')
    parser.add_argument('--files', type=str, nargs='+',
                       help='Changed files for NFR assessment')
    parser.add_argument('--save', type=str,
                       help='Save results to file')
    parser.add_argument('--auto', action='store_true',
                       help='Run automatically (triggered by workflow)')
    
    args = parser.parse_args()
    
    checker = AutomatedGateChecker()
    results = checker.run_automated_checks(args.story, args.files)
    
    if args.save or args.auto:
        checker.save_results(results, args.save)
    
    # Exit code based on recommendation
    if '✅' in results['overall_recommendation']:
        sys.exit(0)  # Success
    elif '⚠️' in results['overall_recommendation']:
        sys.exit(1)  # Warning
    else:
        sys.exit(2)  # Failure

if __name__ == '__main__':
    main()
