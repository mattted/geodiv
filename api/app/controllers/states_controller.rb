class StatesController < ApplicationController

  def index
    render json: State.geo
  end

end
