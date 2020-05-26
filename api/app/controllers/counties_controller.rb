class CountiesController < ApplicationController
  def index
    # x = <<-SQL
    #   SELECT json_build_object(
    #     'type', 'FeatureCollection',
    #     'features', json_agg(
    #       json_build_object(
    #         'type', 'Feature',
    #         'id', id,
    #         'geometry', ST_AsGeoJSON(geom)::json,
    #         'properties', json_build_object(
    #           'stateid', state_id
    #         )
    #       )
    #     )
    #   ) from counties;
    # SQL
    # x = <<-SQL
    #   SELECT jsonb_build_objet(
    #     'type', 'FeatureCollection',
    #     'features', jsonb_agg(features.feature)
    #   )
    #   FROM (
    #     SELECT jsonb_build_object(
    #       'type', 'Feature',
    #       'id', id,
    #       'geometry', ST_AsGeoJSON(geom)::jsonb,
    #       'properties', to_jsonb(inputs) - 'id' - 'geom'
    #     ) AS feature
    #     FROM (SELECT * FROM counties) inputs) features;
    # SQL
    # res = ActiveRecord::Base.connection.execute(x)

    # render json: JSON.dump(res[0])
    x = County.all
    render json: CountySerializer.new(x)
  end
end
