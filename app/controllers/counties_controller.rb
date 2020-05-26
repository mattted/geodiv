class CountiesController < ApplicationController
  def index
    counties = County.all
    render json: counties
  end
end
