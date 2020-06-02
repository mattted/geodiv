class State < ApplicationRecord
  belongs_to :country
  has_many :counties
  has_many :observations, through: :counties

  TO_GEOJSON = <<-SQL
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
        SELECT * FROM states
      ) inputs
    ) features;
  SQL

  def self.geo
    Rails.cache.fetch("state_geo", expires_in: 12.hours) do
      ActiveRecord::Base.connection.execute(TO_GEOJSON)[0]["jsonb_build_object"]
    end
  end

end
