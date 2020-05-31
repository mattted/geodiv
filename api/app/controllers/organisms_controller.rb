class OrganismsController < ApplicationController

  def kingdom
    render json: Organism.kingdom
  end

end
