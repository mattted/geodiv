class ObservationsController < ApplicationController

  def obs_per_county
    render json: Observation.obs_per_county
  end

  def org_per_county
    render json: Observation.org_per_county
  end

  def counties_obs_by_query
    render json: Observation.counties_obs_by_query(params["column"], params["search"])
  end

  def states_obs_by_query
    render json: Observation.states_obs_by_query(params["column"], params["search"])
  end

  def obs_for_inforec
    render json: Observation.obs_for_inforec(params["column"], params["search"])
  end

  def index
    render json: ObservationSerializer.new(Observation.page(1).per(1000))
  end

  def create
    geo_factory = RGeo::Geographic.spherical_factory(srid: 4269)
    obs = Observation.new(obs_params)
    obs.geom = geo_factory.point(obs.lon, obs.lat)
    obs.county = County.find{ |c| c.geom.contains?(obs.geom) }
    obs.organism = Organism.find_by(params["col"].to_sym => params["name"])

    if obs.save
      render json: obs
    else 
      render json: { errors: obs.errors.full_messages.join(', '), status: :unprocessable_entity }
    end
  end

  private

    def obs_params
      params.require(:observation).permit(:date, :lat, :lon)
    end

end
