class ObservationsController < ApplicationController

  def obs_per_county
    render json: Observation.obs_per_county
  end

  def org_per_county
    render json: Observation.org_per_county
  end

  def obs_by_query
    render json: Observation.obs_by_query(params["column"], params["search"])
  end

end
