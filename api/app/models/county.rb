class County < ApplicationRecord
  belongs_to :state
  has_many :observations
  has_many :organisms, through: :observations
end
