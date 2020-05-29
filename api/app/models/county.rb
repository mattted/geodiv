class County < ApplicationRecord
  belongs_to :state
  has_many :observations
  has_many :organisms, through: :observations

  scope :obs_name, -> { joins(:observations).group("counties.name").count }
  scope :obs_id, -> { joins(:observations).group("counties.id").count }
end
