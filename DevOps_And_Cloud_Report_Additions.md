# DevOps & Cloud Infrastructure Implementation Report: GlobeStay

## 1. Project Context: The GlobeStay Application
**GlobeStay** is a dynamic web application built using the **Node.js/Express.js framework** with a **MongoDB** NoSQL database backend. It allows users to browse, list, and review properties/accommodations. The project handles complex interactions, including user authentication (via Passport.js), session management, image uploads (via Cloudinary), and data persistence.

As the application grew in complexity, managing its dependencies (specific Node.js versions, MongoDB setup) and preparing it for reliable, scalable deployment became a challenge. To solve this, DevOps practices—specifically **Containerization** and **Infrastructure as Code (IaC)**—were introduced into the project lifecycle.

---

## 2. Experiment 5 Implementation: Containerization with Docker

### Objective
To package the GlobeStay application and its environment dependencies into an isolated container, ensuring software runs reliably when moved from one computing environment to another.

### Implementation Details
The containerization of GlobeStay was achieved using two primary components:

1. **The `Dockerfile` (App Blueprint):**
   We created a `Dockerfile` using `node:18-alpine`, a lightweight Linux distribution. This file instructs the Docker engine to:
   * Set up a working directory (`/usr/src/app`).
   * Copy the `package.json` to install exactly the dependencies required (Express, Mongoose, Passport, etc.) using `npm install`.
   * Bundle the application source code (routing, controllers, views).
   * Expose port `3000`, the default port the Express server listens on.
   * Run the command `node app.js` to boot the application.
   
   This guarantees that anyone running this image has the exact same Node.js runtime and dependency tree, eliminating the classic "it works on my machine" problem.

2. **Orchestration with `docker-compose.yml`:**
   Because GlobeStay relies heavily on a MongoDB database to store listings, users, and reviews, simply running the Node app isn't enough. We implemented `docker-compose` to orchestrate multi-container environments.
   * **`app` Service:** Builds the GlobeStay Node.js application from the `Dockerfile`.
   * **`mongo` Service:** Pulls the official `mongo:latest` image.
   * **Networking & Volumes:** The compose file automatically wires the application to the database via standard environment variables (`ATLASDB_URL=mongodb://mongo:27017/GlobeStayLocal`). We also configured a named volume (`mongo-data`) so that database records (like new user signups or property listings) survive container restarts.

### Value to the Project
Docker allows our development team to spin up the entire GlobeStay ecosystem (Frontend, Node API, and MongoDB) with a single command: `docker-compose up`.

---

## 3. Experiment 8 Implementation: Infrastructure as Code with Terraform

### Objective
To automate the provisioning of cloud infrastructure (AWS) required to host the GlobeStay application, removing the need for manual, error-prone configuration in cloud dashboards.

### Implementation Details
We introduced **Terraform** (by HashiCorp) to declaratively enforce the infrastructure setup required for cloud deployment. The configuration is housed in the `terraform/` directory.

1. **Network Provisioning (`aws_vpc` & `aws_internet_gateway`):**
   The Terraform script (`main.tf`) initializes a Virtual Private Cloud (VPC) labeled `GlobeStay-VPC` with a `10.0.0.0/16` CIDR block. This creates a secure, isolated network in the cloud specifically for our application.

2. **Security & Access (`aws_security_group`):**
   Instead of manually configuring firewalls, we codified a Security Group (`GlobeStay-Web-SG`) that strictly dictates traffic rules. It explicitly opens:
   * **Port 80 (HTTP):** For standard web traffic routing.
   * **Port 3000:** The designated application port for the Express server.
   * **Port 22 (SSH):** For secure remote administration.

3. **Compute Node Automation (`aws_instance`):**
   The core of the execution is automating the creation of an Amazon EC2 instance (a virtual server). The script defines a `t2.micro` server and attaches our custom security group. 
   
   **The `user_data` Startup Script:**
   The true power of this implementation lies in the `user_data` property block. The moment the EC2 server boots, Terraform injects a bash script that:
   * Updates server packages (`yum update`).
   * Installs and starts the Docker service automatically.
   * Issues the command to pull and run the GlobeStay Docker image mapped to the correct ports.

### Value to the Project
By using Terraform, the entire architecture of GlobeStay—from the lowest networking level to the application runtime—is version-controlled alongside application code. If a server goes down, running `terraform apply` recreates the identical server, installs Docker, and launches the application automatically, showcasing high availability and disaster recovery readiness.
