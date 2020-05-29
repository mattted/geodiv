class Observation < ApplicationRecord
  belongs_to :county
  belongs_to :organism

  scope :num_per_county, -> { group("county_id").count }
  scope :org_per_county, -> { select(:organism_id).distinct.group(:county_id).count }
end
