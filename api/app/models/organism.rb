class Organism < ApplicationRecord
  has_many :observations

  def self.kingdoms
    Rails.cache.fetch("org_kingdoms", expires_in: 12.hours) do
      Organism.select(:kingdom).distinct.pluck(:kingdom)
    end
  end

  def self.cnames
    Rails.cache.fetch("org_cnames", expires_in: 12.hours) do
      Organism.select(:cname).distinct.pluck(:cname).compact
    end
  end

end
