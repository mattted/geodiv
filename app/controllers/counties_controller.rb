class CountiesController < ApplicationController
  def index
    counties = County.all
    render json: CountySerializer.new(counties)
  end
end
