variable "resource_group" {
    type = string
}


variable "app_service_name" { 
    type = string
 }

variable "plan_id" {
    type = string
}

variable "location" {
  type    = string
}


variable "tags" {
  type    = map(string)
}


variable "environment_suffix" {
  type    = string
}

variable "location_shortcode" {
  type    = string
}
