# Terraform configuration for Rukon CDE Infrastructure
# Story 1.24: Infrastructure as Code

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "rukon-terraform-state"
    key    = "cde/terraform.tfstate"
    region = "ap-southeast-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

# S3 Bucket for file storage
resource "aws_s3_bucket" "rukon_files" {
  bucket = "rukon-cde-files-${var.environment}"
  
  tags = {
    Name        = "Rukon CDE Files"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "rukon_files_lifecycle" {
  bucket = aws_s3_bucket.rukon_files.id

  rule {
    id     = "archive-old-versions"
    status = "Enabled"

    noncurrent_version_transition {
      noncurrent_days = 90
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

# CloudFront CDN for file downloads
resource "aws_cloudfront_distribution" "rukon_cdn" {
  enabled = true
  
  origin {
    domain_name = aws_s3_bucket.rukon_files.bucket_regional_domain_name
    origin_id   = "S3-rukon-files"
  }
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-rukon-files"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  tags = {
    Environment = var.environment
  }
}

# Outputs
output "s3_bucket_name" {
  value = aws_s3_bucket.rukon_files.bucket
}

output "cdn_domain" {
  value = aws_cloudfront_distribution.rukon_cdn.domain_name
}
