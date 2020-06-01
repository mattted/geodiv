class Organism < ApplicationRecord
  has_many :observations

  def self.kingdom
    Rails.cache.fetch("org_kingdoms", expires_in: 12.hours) do
      Organism.select(:kingdom).distinct.pluck(:kingdom)
    end
  end

  def self.phylum
    Rails.cache.fetch("org_phylums", expires_in: 12.hours) do
      Organism.select(:phylum).distinct.pluck(:phylum).compact
    end
  end

  def self.klass
    Rails.cache.fetch("org_klasses", expires_in: 12.hours) do
      Organism.select(:klass).distinct.pluck(:klass).compact
    end
  end

  def self.order
    Rails.cache.fetch("org_orders", expires_in: 12.hours) do
      Organism.select(:order).distinct.pluck(:order).compact
    end
  end

  def self.family
    Rails.cache.fetch("org_families", expires_in: 12.hours) do
      Organism.select(:family).distinct.pluck(:family).compact
    end
  end

  def self.genus
    Rails.cache.fetch("org_genuses", expires_in: 12.hours) do
      Organism.select(:genus).distinct.pluck(:genus).compact
    end
  end

  def self.species
    Rails.cache.fetch("org_species", expires_in: 12.hours) do
      Organism.select(:species).distinct.pluck(:species).compact
    end
  end

  def self.cname
    Rails.cache.fetch("org_cnames", expires_in: 12.hours) do
      Organism.select(:cname).distinct.pluck(:cname).compact
    end
  end

end
