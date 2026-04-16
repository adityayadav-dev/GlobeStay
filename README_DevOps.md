# Cloud & DevOps Experiments - Mini Project Additions

This file documents the additional files added to the project to demonstrate Cloud Computing and DevOps principles for academic experiments.

## 1. Containerization (Experiment 5)
**Files Added:**
- `Dockerfile`: Defines the blueprint for the Node.js application container.
- `docker-compose.yml`: Allows running the application and a MongoDB database simultaneously on your local machine using a single command.

**How to show it off:**
* You can explain that by running `docker-compose up`, the application starts up in isolated environments (containers) with all dependencies packaged together. This solves the "it works on my machine" problem.

## 2. Infrastructure as Code / Terraform (Experiment 8)
**Files Added:**
- `terraform/main.tf`: Contains the instructions to provision Cloud Infrastructure (AWS VPC, Security Groups, and an EC2 Instance).
- `terraform/variables.tf`: Configuration variables used by Terraform.

**How to show it off:**
* Terraform allows us to write our server infrastructure as code rather than clicking through cloud portals manually.
* You do **not** need an AWS account. For your demonstration, you only need to show the code (`main.tf`) and explain what it creates:
  1. A **Virtual Private Cloud (VPC)** for networking.
  2. A **Security Group** opening Ports 80 (Web), 3000 (App), and 22 (SSH).
  3. An **EC2 Server instance** that uses `user_data` to automatically install Docker and run our app when it boots up.
