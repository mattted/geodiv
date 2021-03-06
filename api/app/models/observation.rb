class Observation < ApplicationRecord
  belongs_to :county
  belongs_to :organism

  # scope :num_per_county, -> { Rails.cache.fetch('obs_per_county', :expires_in => 12.hours){ group("county_id").count }}
  # scope :org_per_county, -> { Rails.cache.fetch('org_per_county', :expires_in => 12.hours){ select(:organism_id).distinct.group(:county_id).count }}
  # scope :org_per_county, -> { select(:organism_id).distinct.group(:county_id).count }

  def self.obs_per_county
    Rails.cache.fetch("obs_per_county", expires_in: 12.hours) do
      Observation.group("county_id").count
    end
  end

  def self.org_per_county
    Rails.cache.fetch("org_per_county", expires_in: 12.hours) do
      Observation.select(:organism_id).distinct.group(:county_id).count
    end
  end

  def self.counties_obs_by_query(column, searchable)
    Rails.cache.fetch("org_per_county_#{column}_#{searchable}", expires_in: 12.hours) do
      Observation.joins(:organism).where("organisms.#{column} = '#{searchable}'").group("county_id").count
    end
  end

  def self.states_obs_by_query(column, searchable)
    Rails.cache.fetch("org_per_state_#{column}_#{searchable}", expires_in: 12.hours) do
      Observation.joins(:organism).joins(county: :state).where("organisms.#{column} = '#{searchable}'").group("states.id").count
    end
  end

  def self.obs_for_inforec(column, searchable)
    selection = 'observations.date, counties.name, states.name as state, organisms.*, observations.inat'
    Observation.joins(:organism).joins(county: :state).select(selection)
      .where("organisms.#{column} = '#{searchable}' and observations.date is not null")
      .order(date: :desc).page(1).per(20)
  end

  def self.obs_for_inforec_by_geom(column, searchable, geotype, geoid)
    if geotype == "state"
      sql_where = "organisms.#{column} = '#{searchable}' and observations.date is not null and states.id = '#{geoid}'"
    else
      sql_where = "organisms.#{column} = '#{searchable}' and observations.date is not null and counties.id = '#{geoid}'"
    end
    selection = 'observations.date, counties.name, states.name as state, organisms.*, observations.inat'
    Observation.joins(:organism).joins(county: :state).select(selection)
      .where(sql_where)
      .order(date: :desc).page(1).per(20)
  end
end
