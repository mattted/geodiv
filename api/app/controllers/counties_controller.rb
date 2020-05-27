class CountiesController < ApplicationController
  def index
    to_geojson = <<-SQL
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(feature)
      ) FROM (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'id', id,
          'geometry', ST_AsGeoJSON(geom)::jsonb,
          'properties', to_jsonb(inputs) - 'id' - 'geom'
        ) AS feature
        FROM (
          SELECT * FROM counties
        ) inputs
      ) features;
    SQL

    Observation.county_agg.each do |kv|
      byebug
    end

    geojson = ActiveRecord::Base.connection.execute(to_geojson)
    render json: geojson[0]["jsonb_build_object"]
  end
  
end
