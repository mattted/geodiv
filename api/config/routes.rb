Rails.application.routes.draw do

  scope '/api' do 
    resources :counties, only: :index
    resources :states, only: :index
    resources :observations, only: :index
    get 'counties_obs', to: 'counties#counties_obs'
    get 'obs_per_county', to: 'observations#obs_per_county'
    get 'org_per_county', to: 'observations#org_per_county'
    get 'obs_for_inforec', to: 'observations#obs_for_inforec'
    get 'counties_obs_by_query', to: 'observations#counties_obs_by_query'
    get 'states_obs_by_query', to: 'observations#states_obs_by_query'
    get 'kingdom', to: 'organisms#kingdom'
    get 'phylum', to: 'organisms#phylum'
    get 'order', to: 'organisms#order'
    get 'klass', to: 'organisms#klass'
    get 'family', to: 'organisms#family'
    get 'genus', to: 'organisms#genus'
    get 'species', to: 'organisms#species'
    get 'cname', to: 'organisms#cname'
  end
end
