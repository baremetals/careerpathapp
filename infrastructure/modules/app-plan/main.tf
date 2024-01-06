terraform {
    required_providers {
        azurerm = {
        source  = "hashicorp/azurerm"
        version = ">=3.19"
        }
    }
}

variable "location" {
  type    = string
}

variable "environment" {
  type    = string
}

variable "tags" {
  type    = map(string)
}

variable "location_shortcode" {
  type    = string
}

variable "environment_suffix" {
  type    = string
}

variable "resource_group" {
  type    = string
}

variable "sku_name" {
  type    = string
}

variable "worker_count" {
  type    = number
  default = 1
}

variable "app_service_name" { 
    type = string
 }

resource "azurerm_service_plan" "default" {
  name                  = "plan-${var.location_shortcode}-discareer-${var.app_service_name}${var.environment_suffix}"
  location              = var.location
  resource_group_name   = var.resource_group
  os_type               = "Linux"
  sku_name              = var.sku_name
  worker_count          = var.worker_count
  tags                  = var.tags
}

output "id" {
  value = azurerm_service_plan.default.id
}

output "name" {
  value = azurerm_service_plan.default.name
  
}