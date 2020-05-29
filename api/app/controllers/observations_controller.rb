class ObservationsController < ApplicationController

  def num_per_county
    render json: Observation.num_per_county
  end

  def org_per_county
    render json: Observation.org_per_county
  end

end
