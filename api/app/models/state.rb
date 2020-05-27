class State < ApplicationRecord
  belongs_to :country
  has_many :counties


  scope :obs_name, -> { joins(counties: :observations).group("states.name").count }
  scope :obs_id, -> { joins(counties: :observations).group("states.id").count }

end
