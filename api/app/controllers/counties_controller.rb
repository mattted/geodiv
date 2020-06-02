class CountiesController < ApplicationController

  def index
    render json: County.geo
  end

end
