terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "ap-southeast-1"
}

resource "aws_s3_bucket" "cde_storage" {
  bucket = "rukon-cde-storage"

  tags = {
    Name        = "Rukon CDE Storage"
    Environment = "Dev"
  }
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "rukon-vpc"
  }
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "rukon-subnet"
  }
}

resource "aws_db_instance" "default" {
  allocated_storage    = 10
  db_name              = "rukon_cde"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro"
  username             = "postgres"
  password             = "password_to_be_changed"
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
}
