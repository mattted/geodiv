Rails.application.routes.draw do
  
  scope '/api' do 
    resources :counties
    get 'counties_obs', to: 'counties#counties_obs'
  end
end
