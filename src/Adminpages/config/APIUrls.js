
// export const domain = "http://192.168.18.101:9012"
// export const frontend = "http://192.168.18.101:3000"

export const domain = "https://shreesawariyaproperties.com"
export const frontend = "https://shreesawariyaproperties.com"


export const API_URLS = {

  admin_login: `${domain}/api/v1/auth-admin-login`,
  emp_registration: `${domain}/api/v1/auth-emp-registration`,


  dashboard_count: `${domain}/api/v1/dashboard-count`,
  employee_list: `${domain}/api/v1/employee-list`,

  create_leads: `${domain}/api/v1/create-leads`,
  lead_list: `${domain}/api/v1/get-leads`,
  check_mobile_exists:`${domain}/api/v1/check-mobile-exists`,

  add_followup: `${domain}/api/v1/add-followups`,
  get_followup: `${domain}/api/v1/get-followups`,


  add_owners: `${domain}/api/v1/create-owners`,
  get_owner: `${domain}/api/v1/get-owners`,

  create_properties: `${domain}/api/v1/create-properties`,
  get_properties: `${domain}/api/v1/get-properties`,
  get_all_properties_owner: `${domain}/api/v1/get-all-properties-owner`,

  update_properties: `${domain}/api/v1/update-properties`,
  delete_properties: `${domain}/api/v1/delete-properties`,

  create_service_type: `${domain}/api/v1/create-service-type`,
  get_service_type: `${domain}/api/v1/get-service-type`,
  update_service_type: `${domain}/api/v1/update-service-type`,
  update_service_type_status: `${domain}/api/v1/update-service-type-status`,

  create_property_master: `${domain}/api/v1/create-property-type-master`,
  get_property_master: `${domain}/api/v1/get-property-type-master`,
  update_property_master: `${domain}/api/v1/update-property-master`,
  update_property_master_status: `${domain}/api/v1/update-property-master-status`,

  get_followup_master: `${domain}/api/v1/get-followup-master`,
  create_followup_status: `${domain}/api/v1/create-followup-status`,
  update_followup_status: `${domain}/api/v1/update-followup-status`,
  toggle_followup_status: `${domain}/api/v1/update-followup-status-status`,


  get_area: `${domain}/api/v1/get-area`,
  create_area: `${domain}/api/v1/create-area`,
  update_area: `${domain}/api/v1/update-area`,
  toggle_area: `${domain}/api/v1/update-area-status`,

  assign_lead: `${domain}/api/v1/assign-lead-to-employee`,
  assign_property: `${domain}/api/v1/assign-property-to-lead`,


  master_bhk: `${domain}/api/v1/get-bhk-master`,

  employee_excel: `${domain}/api/v1/employee-excel`,
  upload_leads_excel: `${domain}/api/v1/upload-leads-excel`,
  upload_property_excel: `${domain}/api/v1/upload-property-excel`,
  

};
