#!/usr/bin/env python3
"""
Story Progress Tracker
Scans story markdown files and generates progress report.
"""

import os
import re
from pathlib import Path
from datetime import datetime

class StoryProgressTracker:
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.stories_dir = os.path.join(self.project_root, 'docs', 'stories')
        
    def parse_story_file(self, filepath):
        """Parse a story markdown file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract story metadata
        story_id_match = re.search(r'\*\*Story ID\*\*:\s*`([^`]+)`', content)
        priority_match = re.search(r'\*\*Priority\*\*:\s*([^\n]+)', content)
        points_match = re.search(r'\*\*Story Points\*\*:\s*(\d+)', content)
        
        story_id = story_id_match.group(1) if story_id_match else 'Unknown'
        priority = priority_match.group(1).strip() if priority_match else 'Unknown'
        points = int(points_match.group(1)) if points_match else 0
        
        # Extract title
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        title = title_match.group(1) if title_match else os.path.basename(filepath)
        
        # Count checkboxes
        total_tasks = len(re.findall(r'- \[[x /]\]', content))
        completed_tasks = len(re.findall(r'- \[x\]', content, re.IGNORECASE))
        in_progress_tasks = len(re.findall(r'- \[/\]', content))
        
        # Calculate completion percentage
        completion = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Determine status
        if completion == 100:
            status = '✅ Complete'
        elif completion > 0:
            status = '🚧 In Progress'
        else:
            status = '📋 Not Started'
        
        return {
            'id': story_id,
            'title': title,
            'priority': priority,
            'points': points,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'completion': completion,
            'status': status,
            'filepath': filepath,
        }
    
    def scan_epic(self, epic_name):
        """Scan all stories in an epic"""
        epic_dir = os.path.join(self.stories_dir, epic_name)
        
        if not os.path.exists(epic_dir):
            print(f"❌ Epic directory not found: {epic_dir}")
            return []
        
        stories = []
        for filename in sorted(os.listdir(epic_dir)):
            if filename.startswith('story-') and filename.endswith('.md'):
                filepath = os.path.join(epic_dir, filename)
                try:
                    story_data = self.parse_story_file(filepath)
                    stories.append(story_data)
                except Exception as e:
                    print(f"⚠️  Error parsing {filename}: {e}")
        
        return stories
    
    def generate_report(self, epic_name):
        """Generate progress report for an epic"""
        stories = self.scan_epic(epic_name)
        
        if not stories:
            print(f"No stories found in {epic_name}")
            return
        
        # Calculate epic-level metrics
        total_points = sum(s['points'] for s in stories)
        completed_points = sum(s['points'] for s in stories if s['completion'] == 100)
        total_tasks = sum(s['total_tasks'] for s in stories)
        completed_tasks = sum(s['completed_tasks'] for s in stories)
        
        epic_completion = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Print report
        print("=" * 80)
        print(f"📊 PROGRESS REPORT: {epic_name.upper()}")
        print("=" * 80)
        print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        print(f"📈 Epic Metrics:")
        print(f"  Overall Completion: {epic_completion:.1f}%")
        print(f"  Story Points: {completed_points}/{total_points}")
        print(f"  Tasks: {completed_tasks}/{total_tasks}\n")
        
        # Group stories by status
        complete = [s for s in stories if s['completion'] == 100]
        in_progress = [s for s in stories if 0 < s['completion'] < 100]
        not_started = [s for s in stories if s['completion'] == 0]
        
        print(f"✅ Complete: {len(complete)}")
        print(f"🚧 In Progress: {len(in_progress)}")
        print(f"📋 Not Started: {len(not_started)}\n")
        
        print("=" * 80)
        print("STORY BREAKDOWN")
        print("=" * 80)
        
        for story in stories:
            print(f"\n{story['status']} {story['title']}")
            print(f"  ID: {story['id']}")
            print(f"  Priority: {story['priority']}")
            print(f"  Points: {story['points']}")
            print(f"  Progress: {story['completed_tasks']}/{story['total_tasks']} tasks ({story['completion']:.0f}%)")
            
            if story['in_progress_tasks'] > 0:
                print(f"  ⚠️  {story['in_progress_tasks']} tasks in progress")
        
        print("\n" + "=" * 80)
        print("RECOMMENDATIONS")
        print("=" * 80)
        
        if in_progress:
            print("🎯 Focus on completing in-progress stories:")
            for story in in_progress:
                print(f"  - {story['title']} ({story['completion']:.0f}% done)")
        
        if not_started and not in_progress:
            print("🚀 Ready to start next story:")
            # Sort by priority
            priority_order = {'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3}
            not_started_sorted = sorted(
                not_started,
                key=lambda s: priority_order.get(s['priority'].split()[0], 99)
            )
            if not_started_sorted:
                next_story = not_started_sorted[0]
                print(f"  → {next_story['title']} ({next_story['priority']})")
        
        print()

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Story Progress Tracker')
    parser.add_argument('--epic', type=str, default='epic-1', help='Epic to track (e.g., epic-1)')
    
    args = parser.parse_args()
    
    tracker = StoryProgressTracker()
    tracker.generate_report(args.epic)

if __name__ == '__main__':
    main()
