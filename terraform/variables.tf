variable "aws_region" {
  description = "The AWS region to deploy the infrastructure in."
  type        = string
  default     = "ap-south-1" 
}

variable "instance_type" {
  description = "The type of EC2 instance to deploy."
  type        = string
  default     = "t2.micro" # Free tier eligible
}
