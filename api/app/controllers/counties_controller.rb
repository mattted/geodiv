class CountiesController < ApplicationController
  def index
    x = <<-SQL
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

    res = ActiveRecord::Base.connection.execute(x)
    render json: res[0]["jsonb_build_object"]
  end
  
end
