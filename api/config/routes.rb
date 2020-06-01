Rails.application.routes.draw do

  scope '/api' do 
    resources :counties
    get 'counties_obs', to: 'counties#counties_obs'
    get 'obs_per_county', to: 'observations#obs_per_county'
    get 'org_per_county', to: 'observations#org_per_county'
    get 'kingdoms', to: 'organisms#kingdoms'
    get 'cnames', to: 'organisms#cnames'
  end
end
