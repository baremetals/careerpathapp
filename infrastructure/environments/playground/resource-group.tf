module "dis_resource_group" {
  source   = "../../modules/resource-group"
  name     = local.resource_group_name
  location = local.location
  tags     = local.tags
}

# /subscriptions/763d80f6-987a-4929-9a36-17e57b6e1ab7/resourceGroups/discareer