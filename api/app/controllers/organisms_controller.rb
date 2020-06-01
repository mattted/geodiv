class OrganismsController < ApplicationController

  def kingdoms
    render json: Organism.kingdoms
  end

  def cnames
    render json: Organism.cnames
  end

end
