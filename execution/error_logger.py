#!/usr/bin/env python3
"""
Error Logger - Centralized error logging untuk self-annealing system
"""

import os
import json
from datetime import datetime
from pathlib import Path

class ErrorLogger:
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.log_dir = os.path.join(self.project_root, 'execution', 'data')
        self.log_file = os.path.join(self.log_dir, 'error_log.json')
        
        # Ensure log directory exists
        os.makedirs(self.log_dir, exist_ok=True)
        
        # Initialize log file if doesn't exist
        if not os.path.exists(self.log_file):
            self._init_log_file()
    
    def _init_log_file(self):
        """Initialize empty error log"""
        with open(self.log_file, 'w') as f:
            json.dump({'errors': []}, f, indent=2)
    
    def log_error(self, error_type, error_message, context=None, stack_trace=None):
        """Log an error with full context"""
        # Read existing logs
        with open(self.log_file, 'r') as f:
            data = json.load(f)
        
        # Create error entry
        error_entry = {
            'timestamp': datetime.now().isoformat(),
            'error_type': error_type,
            'error_message': error_message,
            'context': context or {},
            'stack_trace': stack_trace,
            'resolved': False,
            'resolution': None,
        }
        
        # Add to log
        data['errors'].append(error_entry)
        
        # Write back
        with open(self.log_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Error logged: {error_type}")
        return error_entry
    
    def mark_resolved(self, error_index, resolution):
        """Mark an error as resolved"""
        with open(self.log_file, 'r') as f:
            data = json.load(f)
        
        if 0 <= error_index < len(data['errors']):
            data['errors'][error_index]['resolved'] = True
            data['errors'][error_index]['resolution'] = resolution
            data['errors'][error_index]['resolved_at'] = datetime.now().isoformat()
            
            with open(self.log_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            print(f"✅ Error #{error_index} marked as resolved")
        else:
            print(f"❌ Invalid error index: {error_index}")
    
    def get_recent_errors(self, limit=10, unresolved_only=False):
        """Get recent errors"""
        with open(self.log_file, 'r') as f:
            data = json.load(f)
        
        errors = data['errors']
        
        if unresolved_only:
            errors = [e for e in errors if not e.get('resolved', False)]
        
        # Return most recent first
        return list(reversed(errors[-limit:]))
    
    def get_error_stats(self):
        """Get error statistics"""
        with open(self.log_file, 'r') as f:
            data = json.load(f)
        
        errors = data['errors']
        total = len(errors)
        resolved = sum(1 for e in errors if e.get('resolved', False))
        unresolved = total - resolved
        
        # Group by type
        by_type = {}
        for error in errors:
            error_type = error['error_type']
            by_type[error_type] = by_type.get(error_type, 0) + 1
        
        return {
            'total': total,
            'resolved': resolved,
            'unresolved': unresolved,
            'by_type': by_type,
        }

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Error Logger')
    parser.add_argument('--log', action='store_true', help='Log a new error')
    parser.add_argument('--error-type', type=str, help='Type of error')
    parser.add_argument('--error-message', type=str, help='Error message')
    parser.add_argument('--context', type=str, help='JSON context')
    parser.add_argument('--stats', action='store_true', help='Show error statistics')
    parser.add_argument('--recent', type=int, help='Show N recent errors')
    
    args = parser.parse_args()
    
    logger = ErrorLogger()
    
    if args.log:
        if not args.error_type or not args.error_message:
            print("❌ --error-type and --error-message are required")
            return
        
        context = json.loads(args.context) if args.context else {}
        logger.log_error(args.error_type, args.error_message, context)
    
    elif args.stats:
        stats = logger.get_error_stats()
        print("=" * 50)
        print("ERROR STATISTICS")
        print("=" * 50)
        print(f"Total Errors: {stats['total']}")
        print(f"Resolved: {stats['resolved']}")
        print(f"Unresolved: {stats['unresolved']}")
        print("\nBy Type:")
        for error_type, count in sorted(stats['by_type'].items(), key=lambda x: -x[1]):
            print(f"  {error_type}: {count}")
    
    elif args.recent:
        errors = logger.get_recent_errors(args.recent)
        print("=" * 50)
        print(f"RECENT ERRORS ({len(errors)})")
        print("=" * 50)
        for i, error in enumerate(errors):
            status = "✅" if error.get('resolved') else "❌"
            print(f"\n{status} [{error['error_type']}]")
            print(f"  Message: {error['error_message']}")
            print(f"  Time: {error['timestamp']}")
            if error.get('resolved'):
                print(f"  Resolution: {error.get('resolution')}")
    
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
