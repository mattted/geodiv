class AddIndexToObservation < ActiveRecord::Migration[6.0]
  def change
    add_index :observations, :date
  end
end
