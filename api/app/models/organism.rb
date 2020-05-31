class Organism < ApplicationRecord
  has_many :observations

  def self.kingdom
    Rails.cache.fetch("kingdom", expires_in: 12.hours) do
      Organism.all
    end
  end

end
