#!/usr/bin/env python3
"""
BMad Task Wrapper - DOE automation wrapper untuk BMad tasks
Allows DOE automation to invoke BMad tasks programmatically
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from datetime import datetime

class BMadTaskWrapper:
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.bmad_core = os.path.join(self.project_root, '.bmad-core')
        self.tasks_dir = os.path.join(self.bmad_core, 'tasks')
        self.qa_assessments_dir = os.path.join(self.project_root, 'docs', 'qa', 'assessments')
        
        # Ensure directories exist
        os.makedirs(self.qa_assessments_dir, exist_ok=True)
    
    def read_task_file(self, task_name):
        """Read BMad task file"""
        task_path = os.path.join(self.tasks_dir, task_name)
        if not os.path.exists(task_path):
            raise FileNotFoundError(f"BMad task not found: {task_name}")
        
        with open(task_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def risk_profile(self, story_file):
        """
        Execute BMad risk-profile task
        Wrapper untuk @qa *risk command
        """
        print(f"🔍 Running BMad Risk Profile for {story_file}...")
        
        # For now, this would typically call the BMad agent
        # In full implementation, this would integrate with agent system
        
        # Generate assessment filename
        story_name = Path(story_file).stem
        today = datetime.now().strftime('%Y%m%d')
        assessment_file = f"{story_name}-risk-{today}.md"
        assessment_path = os.path.join(self.qa_assessments_dir, assessment_file)
        
        print(f"📝 Risk assessment would be generated at: {assessment_path}")
        print("⚠️  Note: Full BMad agent integration required for actual execution")
        
        return {
            'task': 'risk-profile',
            'story': story_file,
            'assessment_file': assessment_path,
            'status': 'pending_agent_execution',
            'command': f'@qa *risk {story_file}'
        }
    
    def test_design(self, story_file):
        """
        Execute BMad test-design task
        Wrapper untuk @qa *design command
        """
        print(f"🧪 Running BMad Test Design for {story_file}...")
        
        story_name = Path(story_file).stem
        today = datetime.now().strftime('%Y%m%d')
        assessment_file = f"{story_name}-test-design-{today}.md"
        assessment_path = os.path.join(self.qa_assessments_dir, assessment_file)
        
        print(f"📝 Test design would be generated at: {assessment_path}")
        print("⚠️  Note: Full BMad agent integration required for actual execution")
        
        return {
            'task': 'test-design',
            'story': story_file,
            'assessment_file': assessment_path,
            'status': 'pending_agent_execution',
            'command': f'@qa *design {story_file}'
        }
    
    def trace_requirements(self, story_file):
        """
        Execute BMad trace-requirements task
        Wrapper untuk @qa *trace command
        """
        print(f"📋 Running BMad Requirements Tracing for {story_file}...")
        
        story_name = Path(story_file).stem
        today = datetime.now().strftime('%Y%m%d')
        assessment_file = f"{story_name}-trace-{today}.md"
        assessment_path = os.path.join(self.qa_assessments_dir, assessment_file)
        
        print(f"📝 Trace matrix would be generated at: {assessment_path}")
        print("⚠️  Note: Full BMad agent integration required for actual execution")
        
        return {
            'task': 'trace-requirements',
            'story': story_file,
            'assessment_file': assessment_path,
            'status': 'pending_agent_execution',
            'command': f'@qa *trace {story_file}'
        }
    
    def nfr_assess(self, story_file):
        """
        Execute BMad nfr-assess task
        Wrapper untuk @qa *nfr command
        """
        print(f"⚡ Running BMad NFR Assessment for {story_file}...")
        
        story_name = Path(story_file).stem
        today = datetime.now().strftime('%Y%m%d')
        assessment_file = f"{story_name}-nfr-{today}.md"
        assessment_path = os.path.join(self.qa_assessments_dir, assessment_file)
        
        print(f"📝 NFR assessment would be generated at: {assessment_path}")
        print("⚠️  Note: Full BMad agent integration required for actual execution")
        
        return {
            'task': 'nfr-assess',
            'story': story_file,
            'assessment_file': assessment_path,
            'status': 'pending_agent_execution',
            'command': f'@qa *nfr {story_file}'
        }
    
    def review_story(self, story_file):
        """
        Execute BMad review-story task
        Wrapper untuk @qa *review command
        """
        print(f"✅ Running BMad Story Review for {story_file}...")
        
        story_name = Path(story_file).stem
        today = datetime.now().strftime('%Y%m%d')
        gate_file = f"{story_name}-gate.yml"
        gate_path = os.path.join(self.project_root, 'docs', 'qa', 'gates', gate_file)
        
        print(f"📝 Quality gate would be generated at: {gate_path}")
        print("⚠️  Note: Full BMad agent integration required for actual execution")
        
        return {
            'task': 'review-story',
            'story': story_file,
            'gate_file': gate_path,
            'status': 'pending_agent_execution',
            'command': f'@qa *review {story_file}'
        }
    
    def check_quality_gate(self, story_file):
        """
        Check if story passes combined quality gate
        Combines BMad gate status dengan DOE metrics
        """
        print(f"🎯 Checking Combined Quality Gate for {story_file}...")
        
        # This would read BMad gate file and DOE metrics
        # For now, return structure
        
        return {
            'bmad_gate': 'PENDING',  # Would read from gate file
            'doe_qa_score': 0,       # Would read from DOE scoring
            'doe_code_quality': 0,   # Would run code quality checker
            'doe_test_coverage': 0,  # Would read from coverage report
            'combined_status': 'PENDING',
            'passes': False
        }

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='BMad Task Wrapper for DOE Automation')
    parser.add_argument('--task', type=str, required=True,
                       choices=['risk', 'design', 'trace', 'nfr', 'review', 'gate'],
                       help='BMad task to execute')
    parser.add_argument('--story', type=str, required=True,
                       help='Path to story file')
    
    args = parser.parse_args()
    
    wrapper = BMadTaskWrapper()
    
    if args.task == 'risk':
        result = wrapper.risk_profile(args.story)
    elif args.task == 'design':
        result = wrapper.test_design(args.story)
    elif args.task == 'trace':
        result = wrapper.trace_requirements(args.story)
    elif args.task == 'nfr':
        result = wrapper.nfr_assess(args.story)
    elif args.task == 'review':
        result = wrapper.review_story(args.story)
    elif args.task == 'gate':
        result = wrapper.check_quality_gate(args.story)
    
    # Print result
    print("\n" + "=" * 50)
    print("RESULT:")
    print(json.dumps(result, indent=2))
    print("\n💡 To execute manually, run:")
    print(f"   {result.get('command', 'N/A')}")
    print("=" * 50)

if __name__ == '__main__':
    main()
