const T = (value) => value;

export const s = {
  add_user: T('Add User'),
  address: T('Address'),
  address_ph: T('Enter Address'),
  city: T('City'),
  country: T('Country'),
  listing_owner: T('Listing Owner'),
  msg_change_ownership: T('Ownership of the following listing will be changed'),
  edit_user: T('Edit User'),
  enter_valid_email: T('Enter a valid email'),
  enter_valid_website: T('Enter a valid website address'),
  enter_valid_email_msg: T('Please enter a valid email'),
  users: T('Users'),
  im: {
    invalid_value: T('Invalid format'),
    phone: T('Invalid format'),
    value_exceeded_max: T('Value exceeds max character limit'),
  },

  invitation: T('Invitation'),
  invite_user: T('Invite User'),
  listed_date: T('Listed Date'),
  reports_listed_date: T('Date'),
  listings_posted: T('Listings Posted'),
  password: T('Password'),
  password_ph: T('Enter password'),
  ph: {
    address: T('Enter address'),
    city: T('Select City'),
    password: T('Enter Password'),
  },

  purpose: T('Purpose'),
  total_agents: T('Total Agents'),
  vm: {
    address: T('Please enter your address'),
    city: T('Please select city'),
    country: T('Please select country'),
    company_title: T('Company title is required'),
    name: T('Please add name'),
    password: T('Password is required'),
    phone: T('Please enter your number'),
  },
  placeholders: {
    city: T('Enter City'),
    listed_date: T('Select Date Range'),
    property_id: T('Enter Listing ID'),
    purpose: T('Select Purpose'),
    users: T('Select Users'),
  },
  error_: 'Error!',
  preview: T('Preview'),
  msg_listing_posted: T('Your property ad has been uploaded successfully!'),
  upload_more_images: T('Upload More Images'),
  upload_images: T('Upload Images'),
};

const obj = s;
export const strings = new Proxy(obj, {
  get(target, name) {
    return target.hasOwnProperty(name) ? target[name] : `==${name}==`;
  },
});
