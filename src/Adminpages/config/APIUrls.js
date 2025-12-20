
export const domain = "http://192.168.18.101:9033"
export const frontend = "http://192.168.18.101:3000"


export const API_URLS = {

  admin_login: `${domain}/api/v1/auth-admin-login`,

  create_leads: `${domain}/api/v1/create-leads`,
  lead_list: `${domain}/api/v1/get-leads`,

  add_followup: `${domain}/api/v1/add-followups`,
  get_followup: `${domain}/api/v1/get-followups`,


  add_owners: `${domain}/api/v1/create-owners`,
  get_owner: `${domain}/api/v1/get-owners`,

  create_properties: `${domain}/api/v1/create-properties`,
  get_properties: `${domain}/api/v1/get-properties`,
  update_properties: `${domain}/api/v1/update-properties`,
  delete_properties: `${domain}/api/v1/delete-properties`,

};
