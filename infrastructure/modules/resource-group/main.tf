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

variable "name" {
  type    = string
}

variable "tags" {
  type    = map(string)
}

resource "azurerm_resource_group" "default" {
  name     = var.name
  location = var.location
  tags = var.tags
}

output "id" {
  value = azurerm_resource_group.default.id
}

output "name" {
  value = azurerm_resource_group.default.name
  
}