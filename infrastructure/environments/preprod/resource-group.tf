module "dis_resource_group" {
  source   = "../../modules/resource-group"
  name     = local.resource_group_name
  location = local.location
  tags     = local.tags
}