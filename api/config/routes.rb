Rails.application.routes.draw do
  
  scope '/api' do 
    resources :counties
    get 'counties_obs', to: 'counties#counties_obs'
    get 'num_per_county', to: 'observations#num_per_county'
    get 'org_per_county', to: 'observations#org_per_county'
  end
end
