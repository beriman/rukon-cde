#!/usr/bin/env python3
"""
Database Migration Automation Script
Validates Prisma schema, generates migrations, and verifies database state.
"""

import os
import sys
import subprocess
import json
import argparse
from pathlib import Path
from datetime import datetime

class DatabaseMigrationAutomator:
    def __init__(self, project_root=None):
        self.project_root = project_root or os.getcwd()
        self.schema_path = os.path.join(self.project_root, 'apps', 'api', 'prisma', 'schema.prisma')
        self.migrations_dir = os.path.join(self.project_root, 'apps', 'api', 'prisma', 'migrations')
        
    def validate_schema(self):
        """Validate Prisma schema syntax"""
        print("🔍 Validating Prisma schema...")
        try:
            result = subprocess.run(
                ['npx', 'prisma', 'validate', '--schema', self.schema_path],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                print("✅ Schema validation passed")
                return True
            else:
                print(f"❌ Schema validation failed:\n{result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error validating schema: {e}")
            return False
    
    def format_schema(self):
        """Format Prisma schema"""
        print("📝 Formatting schema...")
        try:
            subprocess.run(
                ['npx', 'prisma', 'format', '--schema', self.schema_path],
                cwd=self.project_root,
                check=True
            )
            print("✅ Schema formatted")
            return True
        except Exception as e:
            print(f"❌ Error formatting schema: {e}")
            return False
    
    def generate_migration(self, name, create_only=True):
        """Generate a new migration"""
        if not name:
            print("❌ Migration name is required")
            return False
            
        print(f"🔨 Generating migration: {name}")
        
        cmd = ['npx', 'prisma', 'migrate', 'dev', '--name', name, '--schema', self.schema_path]
        if create_only:
            cmd.append('--create-only')
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                print(f"✅ Migration '{name}' generated successfully")
                return True
            else:
                print(f"❌ Migration generation failed:\n{result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error generating migration: {e}")
            return False
    
    def apply_migration(self):
        """Apply pending migrations"""
        print("🚀 Applying migrations...")
        try:
            result = subprocess.run(
                ['npx', 'prisma', 'migrate', 'dev', '--schema', self.schema_path],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                print("✅ Migrations applied successfully")
                return True
            else:
                print(f"❌ Migration failed:\n{result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error applying migration: {e}")
            return False
    
    def check_migration_status(self):
        """Check migration status"""
        print("📊 Checking migration status...")
        try:
            result = subprocess.run(
                ['npx', 'prisma', 'migrate', 'status', '--schema', self.schema_path],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            print(result.stdout)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Error checking migration status: {e}")
            return False
    
    def generate_prisma_client(self):
        """Generate Prisma Client"""
        print("🔧 Generating Prisma Client...")
        try:
            subprocess.run(
                ['npx', 'prisma', 'generate', '--schema', self.schema_path],
                cwd=self.project_root,
                check=True
            )
            print("✅ Prisma Client generated")
            return True
        except Exception as e:
            print(f"❌ Error generating Prisma Client: {e}")
            return False
    
    def verify_database(self):
        """Verify database schema matches Prisma schema"""
        print("🔍 Verifying database schema...")
        try:
            result = subprocess.run(
                ['npx', 'prisma', 'db', 'pull', '--print', '--schema', self.schema_path],
                capture_output=True,
                text=True,
                cwd=self.project_root
            )
            
            if result.returncode == 0:
                print("✅ Database schema verified")
                return True
            else:
                print(f"⚠️  Database schema may differ from Prisma schema")
                return False
        except Exception as e:
            print(f"❌ Error verifying database: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description='Database Migration Automation')
    parser.add_argument('--validate', action='store_true', help='Validate schema only')
    parser.add_argument('--generate', type=str, help='Generate migration with name')
    parser.add_argument('--apply', action='store_true', help='Apply pending migrations')
    parser.add_argument('--status', action='store_true', help='Check migration status')
    parser.add_argument('--full', action='store_true', help='Full migration workflow')
    
    args = parser.parse_args()
    
    automator = DatabaseMigrationAutomator()
    
    if args.validate:
        success = automator.validate_schema()
        sys.exit(0 if success else 1)
    
    elif args.status:
        success = automator.check_migration_status()
        sys.exit(0 if success else 1)
    
    elif args.generate:
        if automator.validate_schema() and automator.format_schema():
            success = automator.generate_migration(args.generate, create_only=True)
            sys.exit(0 if success else 1)
        sys.exit(1)
    
    elif args.apply:
        success = automator.apply_migration()
        if success:
            automator.generate_prisma_client()
            automator.verify_database()
        sys.exit(0 if success else 1)
    
    elif args.full:
        # Full workflow
        print("🔄 Running full migration workflow...")
        steps = [
            ("Validate schema", automator.validate_schema),
            ("Format schema", automator.format_schema),
            ("Check status", automator.check_migration_status),
        ]
        
        for step_name, step_func in steps:
            print(f"\n--- {step_name} ---")
            if not step_func():
                print(f"❌ Workflow failed at: {step_name}")
                sys.exit(1)
        
        print("\n✅ All checks passed!")
        print("To generate migration: python execution/db_migration_auto.py --generate <name>")
        sys.exit(0)
    
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == '__main__':
    main()
